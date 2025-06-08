"use client";
import React, { use } from 'react';
import EditProfile from "../../../components/EditProlfile"
interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  return (
    <div>
      <EditProfile profileId={resolvedParams.id} />
    </div>
  )
}

export default Page;
