import { v4 } from "uuid";

export const Items=[
    {
      'id': v4(),
      'name': "Develope the Admin panel",
      "description":"Assign to Nayan"
    },
    {
      'id': v4(),
      'name': "Design the User panel",
      "description":"Assign to Rajan"
    }
]

export const DefaultObject={
    "todo": {
      title: "Todo",
      items: []
    },
    "in-progress": {
      title: "In Progress",
      items: []
    },
    "done": {
      title: "Completed",
      items: []
    }
}