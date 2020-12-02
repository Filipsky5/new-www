export type Tag = string

export interface Edge {
    node: any
}

export interface GQLData {
    allMarkdownRemark: {
        edges: Edge[]
    }
}

export interface BlogPostModel {
    id: string
    author: string
    author_id: unknown
    comments: boolean
    date: string
    slug: string
    excerpt: string
    image: string
    tags: Tag[]
    title: string
}

export interface ProjectModel {
    title: string
    slug: string
    image: string
    layout: string
    published: string
    order?: number
    tags: Tag[]
}