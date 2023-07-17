import { RancherClient } from "src/lib/rancher-client";

export const getPodLogs = async (
  clusterId: string,
  environment: string,
  deploymentId: string,
  rancherClient: RancherClient
): Promise<string[]> => {
  const pods = await rancherClient
    .getPods(clusterId as string)
    .then((res: any) =>
      res.data
        .filter((value: any) => value.id.includes(deploymentId))
        .map((pod: any) => pod.id.replace(`${pod.metadata.namespace}/`, ""))
    );

  return pods.map((pod: string) =>
    rancherClient.getLogs(clusterId as string, environment as string, pod)
  );
};
