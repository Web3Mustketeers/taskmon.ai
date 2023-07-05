export interface IBoard {
  name: string
  isActive: boolean
  columns: {
    name: string
    tasks: {
      title: string
      description: string
      status: string
      subtasks: {
        title: string
        isCompleted: boolean
      }[]
    }[]
  }[]
}

export interface IColumn {
  name: string
  tasks: {
    title: string
    description: string
    status: string
    subtasks: {
      title: string
      isCompleted: boolean
    }[]
  }[]
}

export interface ITask {
  title: string
  description: string
  status: string
  subtasks: {
    title: string
    isCompleted: boolean
  }[]
}

export interface ISubtask {
  title: string
  isCompleted: boolean
}
