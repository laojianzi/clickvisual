import styles from "./index.less";
import { useEffect, useState } from "react";
import { useModel } from "umi";
import DashboardTop from "./components/DashboardTop";
import RunningStatus from "./components/RunningStatus";
import CompletionTask from "./components/CompletionTask";
import Screening from "./components/Screening";
import { Spin } from "antd";

export interface dashboardDataType {
  nodeFailed: number;
  nodeSuccess: number;
  nodeUnknown: number;
  workerFailed: number;
  workerSuccess: number;
  workerUnknown: number;
  flows?: {
    timestamp: number;
    unknown: number;
    failed: number;
    success: number;
  }[];
}

const StatisticalBoard = () => {
  const [dashboardData, setDashboardData] = useState<dashboardDataType>({
    nodeFailed: 0,
    nodeSuccess: 0,
    nodeUnknown: 0,
    workerFailed: 0,
    workerSuccess: 0,
    workerUnknown: 0,
    flows: [],
  });
  const { statisticalBoard, currentInstances } = useModel("dataAnalysis");
  const { doGetDashboard } = statisticalBoard;

  const getList = (data: {
    start?: number;
    end?: number;
    isInCharge?: number;
  }) => {
    if (!currentInstances) return;
    const newData = {
      iid: currentInstances,
      isInCharge: data.isInCharge,
      end: Math.floor((data?.end || 0) / 1000),
      start: Math.floor((data?.start || 0) / 1000),
    };
    doGetDashboard.run(newData).then((res: any) => {
      if (res.code != 0) return;
      setDashboardData(res.data);
    });
  };

  return (
    <div className={styles.statisticalBoard}>
      <Screening onGetList={getList} iid={currentInstances as number} />
      <Spin spinning={doGetDashboard.loading}>
        <DashboardTop dashboardData={dashboardData} />
        <div className={styles.flexBox}>
          <RunningStatus dashboardData={dashboardData} />
          <CompletionTask dataList={dashboardData?.flows || []} />
        </div>
      </Spin>
    </div>
  );
};
export default StatisticalBoard;
