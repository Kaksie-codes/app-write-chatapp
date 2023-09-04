import React, { useEffect, useState } from 'react'
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig'
import { ID } from 'appwrite';
import { Trash2 } from 'react-feather';

const Room = () => {
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');

    useEffect(() => {
        getMessages();
        const unsubscribe = client.subscribe([`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`], response => {            
                // console.log('REAL TIME', response);
            if(response.events.includes("databases.*.collections.*.documents.*.create")){
                console.log('A NEW MESSAGE WAS CREATED');
                setMessages(prevState => [response.payload, ...prevState])
            }
            if(response.events.includes("databases.*.collections.*.documents.*.delete")){
                console.log('A NEW MESSAGE WAS DELETED');
                setMessages(messages.filter(message => message.$id !== response.payload.$id ))
            }
        })

        return () => {
            unsubscribe();
        }
    }, [])

    const getMessages = async () => {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES);
        console.log('RESPONSE:', response);
        setMessages(response.documents);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let payload = {
            body: messageBody
        }
        let response = await databases.createDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, ID.unique(), payload);
        setMessageBody('');
        console.log('CREATED:', response);        
    }

    const deleteMessage = async (message_id) => {
        databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);
        // setMessages(messages.filter(message => message.$id !== message_id))
    }
  return (
    <main className='container'>
        <div className="room--container">
            <form onSubmit={handleSubmit} id="message--form">
                <div>
                    <textarea 
                    name="" id="" 
                    required 
                    maxLength='1000' 
                    placeholder='Say Something...'
                    onChange={(e) => setMessageBody(e.target.value)}
                    value={messageBody}
                    ></textarea>
                </div>
                <div className='send-btn--wrapper'>
                    <input type="submit" value="Send"  className='btn btn--secondary'/>
                </div>
            </form>
            <div>
                {messages && messages.map((message, index) => {
                    return (
                        <div key={message.$id} className='message--wrapper'>
                            <div className='message--header'>
                                <small className='message-timestamp'>{new Date(message.$createdAt).toLocaleString()}</small>
                                <Trash2 onClick={() => deleteMessage(message.$id)} className='delete--btn'/>                                
                            </div>
                            <div className='message--body'>
                                <span>{message.body}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </main>
  )
}

export default Room