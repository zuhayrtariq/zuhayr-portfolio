export interface AnimationContainerProps {
    children: React.ReactNode;
    customClassName?: string;
    customDelay?: number;
}

export interface TimelineItemProps {
    active?: boolean;
    children: React.ReactNode;
    last?: boolean;
}

export interface Project {
    title: string;
    description: string;
    github: string;
    link: string;
    stack?: string[];

};

export interface AboutProps {
    description: string[];
}

export interface CategoryProps {
    name: string;
    description: string;
}

export interface BlogProps {
    slug: string;
    title: string;
    views: number;
    description: string;
    content: any;
    categories: CategoryProps[];
    createdAt: string;
    publishedAt: string;
}

export interface ClientProps {
    name: string;
    email: string;
    phone: string;
    message: string;
}
