// file đã bị rename từ task.model.ts -> task-status-enum.ts
// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: TaskStatus;
// }
// xoá interface Task, để lại enum TaskStatus
export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
