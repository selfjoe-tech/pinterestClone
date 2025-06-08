"use client";
import React, { use } from 'react';
import ProfilePage from "../../../components/ProfilePage";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  return (
    <div>
      <ProfilePage profileId={resolvedParams.id} />
    </div>
  )
}

export default Page;
