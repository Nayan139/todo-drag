import React, {useState,useEffect} from 'react';
import _ from "lodash";
import {v4} from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DefaultObject, Items } from '../mock';
import './Home.css'

const Home = () => {
    const [text, setText] = useState("")
    const [description, setDescription] = useState('')
    const [error, setError] = useState(false)
    const [isDeleted, setIsDeleted] = useState(DefaultObject)
    const [total, setTotal] = useState(0)

    const [state, setState] = useState({
        "todo": {
          title: "Todo",
          items: [...Items]
        },
        "in-progress": {
          title: "In Progress",
          items: []
        },
        "done": {
          title: "Completed",
          items: []
        }
    })

    useEffect(() => {
        let totalDeleted = 0;
        totalDeleted = Object.keys(isDeleted).map((key) => isDeleted[key].items.length ? totalDeleted += isDeleted[key].items.length :null).reduce((prev,curr)=> prev>curr?prev:curr,0)
        setTotal(totalDeleted??0)
    }, [isDeleted])
    

    const handleDragEnd = ({destination, source}) => {
      if (!destination) {
        return
      }

      if (destination.index === source.index && destination.droppableId === source.droppableId) {
        return
      }

      // Creating a copy of item before removing it from state
      const itemCopy = {...state[source.droppableId].items[source.index]}

      setState(prev => {
        prev = {...prev}
        // Remove from previous items array
        prev[source.droppableId].items.splice(source.index, 1)


        // Adding to new items array location
        prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

        return prev
      })
    }

    const addItem = () => {
        if (!text || !description)
          return setError(true)
            setState(prev => {
              return {
                ...prev,
                todo: {
                  title: "Todo",
                  items: [
                    {
                        id: v4(),
                        name: text,
                        description:description
                    },
                    ...prev.todo.items
                  ]
                }
              }
            })
        setText("")
        setDescription("")
    }

    const handleDelete = (data,el,key) => {
        setIsDeleted(prev => {
          return {
            ...prev,
            [key]: {
              title: data.title,
              items: [
                el,
                ...prev[key].items
              ]
            }
          }
        })
        setState(prev => {
          return {
            ...prev,
            [key]: {
              title: data.title,
              items: state[key].items.length ? state[key].items.filter((item) => item.id !== el.id) : []
            }
          }
        })
    }
   
    const restore = () => {
        Object.keys(isDeleted).map((key) => {
          return  isDeleted[key].items.length &&
              setState(prev => {
              return {
                ...prev,
                [key]: {
                  title: prev[key].title,
                  items: [
                    ...isDeleted[key].items,
                    ...prev[key].items
                  ]
                }
              }
            })
        })
        setIsDeleted(DefaultObject)
    }
  return (
    <div className="App">
        <div className='add-container'>
              <h4>Drag and Drop Todo List with Restore</h4>
            <div className='input-main'>
                <input type="text" placeholder='Title' value={text} onChange={(e) => { setText(e.target.value);  setError(false)}} />
                <input type="text" placeholder='Description' value={description} onChange={(e) => { setDescription(e.target.value); setError(false)}} />
            </div>
                {error && <p className='error'>Title and Description must have value.</p>}  
              <button onClick={addItem}>Add</button>
              <button onClick={restore}>Restore</button>
              <p className='info'>{`Total Deleted Tasks are  ${total}`}</p>
        </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {_.map(state, (data, key) => {
          return(
            <div key={key} className={"column"}>
              <h3>{data.title}</h3>
              <Droppable droppableId={key}>
                {(provided, snapshot) => {
                  return(
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={"droppable-col"}
                    >
                      {data.items.map((el, index) => {
                        return(
                          <Draggable key={el.id} index={index} draggableId={el.id}>
                            {(provided, snapshot) => {
                              return(
                                <div
                                  className={`item ${snapshot.isDragging && "dragging"}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                    <p className='title'>Title: {el.name}</p>  
                                    <p className='title'>Description:{el.description}</p>
                                    <button className='title' onClick={()=>handleDelete(data,el,key)}>Delete </button>
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
            </div>
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default Home