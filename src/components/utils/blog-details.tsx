"use client";

import { BlogProps } from "@/types";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { Button } from "../ui/button";
import AnimationContainer from "./animation-container";
import MarkdownRenderer from "./markdown-renderer";

interface Props {
  blog: BlogProps;
}

const BlogDetails = ({ blog }: Props) => {
  return (
    <div className="flex flex-col w-full">
      <AnimationContainer>
        <Link href="/blog">
          <Button size="sm" variant="secondary">
            <ArrowLeftIcon className="size-4 mr-1.5" />
            Back
          </Button>
        </Link>
      </AnimationContainer>

      <AnimationContainer className="flex flex-col items-start w-full mt-8">
        <h2 className="text-xl lg:text-3xl font-bold text-neutral-50 break-words">
          {blog?.title}
        </h2>
        <p className="text-sm text-neutral-400 font-normal mt-4">
          Written by Zuhayr Tariq on{" "}
          {moment(blog?.publishedAt).format("DD MMM YYYY")}
        </p>
        <div className="flex flex-row items-center mt-6">
          <span className="text-sm text-neutral-200 flex items-center">
            <ClockIcon className="w-4 h-4 text-neutral-200 mr-1.5" />
            {moment(blog?.publishedAt).fromNow()}
          </span>
        </div>
        <hr className="w-full border border-border h-px my-6" />
      </AnimationContainer>

      <AnimationContainer className="w-full">
        <div className="prose-container">
          <MarkdownRenderer blog={blog} />
        </div>
      </AnimationContainer>
    </div>
  );
};

export default BlogDetails;
