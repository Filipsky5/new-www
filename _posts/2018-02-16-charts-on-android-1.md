---
layout: post
title: Your first chart in Android App with CSV parser
author: radek
hidden: true
tags: ['android', 'UI', 'chart', 'CSV']
comments: true
image: /images/radek/chart_mobile.jpg
---

If you ever needed to add a chart to your Android app you certainly heard about [MPAndroidChart](https://github.com/PhilJay/MPAndroidChart) by [PhilJay](https://github.com/PhilJay). If not, consider use this powerful library. Let me show you how easy it is to start!

![header img](/images/radek/chart_mobile.jpg)

### Goal
The goal is to build a simple app written in `Kotlin` which displays linear chart with static data. To make it a little bit more interesting we're going to provide data with `.csv` file. It is very simple format for storing table-based data in form of text files where values are separated with comas (Coma Separated Values). We'll use [`OpenCSV`](http://opencsv.sourceforge.net/) library to parse it.

### Dependencies

First add dependencies to gradle files.
```
allprojects {
    repositories {
        ...
        maven { url "https://jitpack.io" }
```

```
dependencies {
    ...
    implementation "com.github.PhilJay:MPAndroidChart:v3.0.3"
    implementation "com.opencsv:opencsv:4.1"
```

### Raw Data Set
Find some data, for example from [_here_](kaggle.com/datasets). I chose [_food searches on google_](https://www.kaggle.com/GoogleNewsLab/food-searches-on-google-since-2004) set and cut it a little to display comparison of two searches: `banana bread` and `frozen yogurt`. File looks like this:
``` csv
id,googleTopic,week_id,value
banana-bread,/m/04cym9,2004-01,30
banana-bread,/m/04cym9,2004-02,31
banana-bread,/m/04cym9,2004-03,24
banana-bread,/m/04cym9,2004-04,27
...
```

There are `676` in both datasets. Values are normalised, so `value` is between `0` and `100`, where `0` is lowest number of searches, `100` is the largest, and the rest are calculated proportionally.

Put `banana_bread.csv` & `frozen_yogurt.csv` under `/app/res/raw` directory in your project.

Now let's make `data class` with corresponding field, simplest as can be:

`FoodSearch.kt`  
``` kotlin
package com.bi.chartapp

data class FoodSearch(
        val id: String,
        val googleTopic: String,
        val week_id: String,
        val value: Int
) {
    override fun toString(): String = "$id::$googleTopic::$week_id::$value"
}
```

### How to parse it?
Take a look at parser below:

`Parser.kt`
``` kotlin
package com.bi.chartapp

import com.opencsv.CSVReaderBuilder
import java.io.Reader

class Parser {

    companion object {

        fun toDataSet(reader: Reader): List<FoodSearch> {

            val csvReader = CSVReaderBuilder(reader)
                    .withSkipLines(1)
                    .build()

            val foodSearches = mutableListOf<FoodSearch>()
            var record = csvReader.readNext()

            while (record != null) {
                foodSearches.add(FoodSearch(record[0], record[1], record[2], record[3].toInt()))
                record = csvReader.readNext()
            }

            return foodSearches
        }
    }
}
```
Static method builds list of `FoodSearch` records based on provided `Reader`. You can get reader from fileStream, which is provided with activity resources. Looks like this:

``` kotlin
val streamBananas = resources.openRawResource(R.raw.banana_bread)
val bananaData = Parser.toDataSet(streamBananas.reader())
```

Finaly our data looks a little bit more friendly. Time to make a chart!

### Apply data

Add LineChart view to your layout, for example:
``` xml
<com.github.mikephil.charting.charts.LineChart
        android:id="@+id/lineChart"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_centerInParent="true" />
```
How to manage data now?

`LineChart` accepts data as an instance of `LineData` class. `LineData` is created from at least one instance of `LineDataSet`. `LineDataSet` is created from `MutableList` of `Entry` objects and `String` label. Huh. And `Entry` is an object representing single point on our Chart (basically is an (x,y) representation). Sounds a little bit overwhelming at first, but is pretty simple. Here are steps to follow:

1. Parse your data from csv file to list of any data objects representing single point on the chart - DONE!
2. Map list of data objects to list of `Entry` objects
3. Create `LineDataSet` from list of entries and label, like "Banana Bread"
4. Each set use as an argument to create `LineData` object. Voila.

Take a look at the code now:

``` kotlin

private fun getEntriesFromCSV(rawResId: Int, label: String): LineDataSet {

    val stream = resources.openRawResource(rawResId)
    val data = Parser.toDataSet(stream.reader())
    val entries: MutableList<Entry> = ArrayList()

    data.mapIndexed { index, foodSearch ->
        entries.add(
                Entry(index.toFloat(), foodSearch.value.toFloat(), foodSearch)
        )
    }

    return LineDataSet(entries, label)
}
```

This function and Parser from previous paragraph creates DataSet from `csv` resource. Now simply call it for each `csv` file and create `LineData`:

``` kotlin
val bananaDataSet = getEntriesFromCSV(R.raw.banana_bread, "Banana Bread")
val yogurtDataSet = getEntriesFromCSV(R.raw.frozen_yogurt, "Frozen Yogurt")

lineChart.data = LineData(
        bananaDataSet,
        yogurtDataSet
)
```

That's it, chart is set up with data!
![chart one](/images/radek/chart_ugly.png)

### Make me beautiful - LineChart properties
Chart layout configuration is very flexible. I'll show you some basic properties, the rest you may find in [documentation](https://github.com/PhilJay/MPAndroidChart/wiki). They are separated between dataset-specific and chart-specific.

##### Tune up data sets

First add some colors to the resource `colors.xml` file in order to make banana look a little bit more like <span style="color:#ffe100">banana</span> and yogurt like <span style="color:#0085c7">yogurt</span>.

``` xml
<color name="banana">#ffe100</color>
<color name="yogurt">#0085c7</color>
```
We'll configure each of the `LineDataSet` object the same way, but with different color. Check out method below with the comments:

``` kotlin
private fun configureSetLayout(set: LineDataSet, color: Int) {

    set.color = color                         // color of the line
    set.setDrawFilled(true)                   // fill the space between line and chart bottom
    set.fillColor = color                     // color of the fill
    set.setDrawCircles(false)                 // disable drawing circles over each Entry point
    set.mode = LineDataSet.Mode.CUBIC_BEZIER  // round the line
    set.fillAlpha = 50                        // make fill transparent with alpha (0-255)

}
```

Now apply configuration to each dataset:

``` kotlin
val bananaColor = resources.getColor(R.color.banana, null)
val yogurtColor = resources.getColor(R.color.yogurt, null)

configureSetLayout(bananaDataSet, bananaColor)
configureSetLayout(yogurtDataSet, yogurtColor)
```

##### Tune up chart

You may configure chart behaviour in many ways. Default setting allows the user to scale the chart with pinching and scroll it. Since our dataset conatains ~700 records let's leave the ability to scale the chart along the axis X and only block the ability to scale it along axis Y. Also remove description from right bottom corner and highlighting values. Like that:

``` kotlin
lineChart.description.isEnabled = false

lineChart.isHighlightPerTapEnabled = false
lineChart.isHighlightPerDragEnabled = false
lineChart.isScaleYEnabled = false
```

Works more intuitive already. Now notice that description above top X axis are float values. They doesn't say much unfortunately. It would be better if they mark year's change every 52 weeks! To achieve this use `IAxisValueFormatter`. It looks like this:

``` kotlin
inner class MyAxisFormatter : IAxisValueFormatter {
    override fun getFormattedValue(value: Float, axis: AxisBase?): String {
        return if (value.toInt() % 52 == 0) "${startingYear + value.toInt() / 52}"
        else ""
    }
}
```
Means that it will display value only if is divisible by `52`. And then maps the value to corresponding year (with starting year set to 2004). We need also proper granularity so there won't be any grid between years.

``` kotlin
lineChart.xAxis.valueFormatter = MyAxisFormatter()
lineChart.xAxis.granularity = 52f
```
 Also who needs Y axis on both sides? Disable one of them:
 ``` kotlin
 lineChart.axisRight.isEnabled = false
 ```

 Boom! That's it! Looks nice and data is clear. Pinch to zoom, swipe right and left to get through all these years and finally check when frozen yogurt beats banana bread in google searches!  
![chart two](/images/radek/chart_bjutiful.png)  
Oh, looks like every year around summer! Who would know.

### Refs:
[Wiki](https://github.com/PhilJay/MPAndroidChart/wiki) & [Issues](https://github.com/PhilJay/MPAndroidChart/issues)