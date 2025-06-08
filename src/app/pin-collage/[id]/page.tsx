"use client";
import React, { use } from 'react';
import CollagePostPage from "../../../components/PostPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <div>
      <CollagePostPage id={resolvedParams.id} />
    </div>
  );
}