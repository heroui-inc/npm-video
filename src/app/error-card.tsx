"use client";

import {Card} from "@heroui/react";

export function ErrorCard({packageName}: {packageName: string}) {
  return (
    <Card className="w-full h-full">
      <Card.Header>
        <Card.Title>Error</Card.Title>
        <Card.Description>Package not found</Card.Description>
      </Card.Header>
      <Card.Content>
        <p>
          It looks like the package you entered (<strong>{packageName}</strong>) does not exist.
        </p>
      </Card.Content>
    </Card>
  );
}
