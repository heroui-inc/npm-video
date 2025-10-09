import {Card, CardBody, CardHeader} from "@heroui/card";

export function ErrorCard({packageName}: {packageName: string}) {
  return (
    <Card className="bg-content1 w-full h-full">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Error</h3>
        <p className="text-sm text-foreground-500">Package not found</p>
      </CardHeader>
      <CardBody>
        <p>
          It looks like the package you entered (<strong>{packageName}</strong>) does not exist.
        </p>
      </CardBody>
    </Card>
  );
}
