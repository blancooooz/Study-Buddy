import {CohereClientV2 } from 'cohere-ai';
import { useSelector } from 'react-redux';
const COHERE_API_URL = 'https://api.cohere.ai';
const COHERE_API_KEY = 'CUENcJOyxt5uKIozJilkNDGmLrb3fzJKmzsIBF66'; // Replace with your actual API key
const cohere = new CohereClientV2({ //initializing the cohere client
    token: COHERE_API_KEY,
})
//TODO - generate a new prompt based off of getRandomTasks, make sure it all works well 
//with the generateText function. After that, clean the file up and make more functions for like generate sutyd plan , etc.
interface Task {
    title: string; // title of task
    deadline: string; // deadline of task
    description: string; // description of task
    tags: string[]; // tags for the task like essay, problem set, discussion, etc
    id: string; // id for task
    recurring: boolean; // recurring Boolean variable
    priority: number;
    completed: boolean;
    time_due: string;
    createdAt: string;
    updatedAt: string; // seconds since 1970
    multiStep: boolean; // checks if the task is a multi step tasks (a task that has multiple parts)
    subTasks: Task[]; // the tasks that are part of the multi step task
    collaborative: boolean; // optional feature, just adding it here just in case, collaborative tasks with other users (friend system)
    users: string[]; // the users with the collaborative feature
    reminder: {
        enabled: boolean;
        reminder_time: string;
    };
    attachments: string[];
    subject: { // classes, so like art history, math core, etc.
        name: string; // name of subject
        color: string; // color of subject
    };
    urgent: boolean; // urgent tag for urgent tasks
}
//prompt that will go into the generateText function

interface GenerateTextResponse {
    text: string;
}
interface RootState { //need this to get the tasks from the redux store
    tasks: Task[];
}

export const getLatestTasks = () => {
    const tasks = useSelector((state: RootState) => state.tasks || []);
    if (tasks.length === 0) { // if user's tasks are empty
        console.warn('No tasks available');
        return [];
    }
    if (tasks.length < 10) { //if user doesn't have enough data to run AI on
        console.warn('You need at least 10 tasks.');
        return [];
    }
    // Sort tasks by createdAt property in descending order
    const sortedTasks = tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sortedTasks.slice(0, 10); // Get the latest 10 tasks
};
export const getRandomTasks = (count: number) => {
    if (count <= 0) {
        return [];
    }
    const tasks: Task[] = getLatestTasks();
    const shuffled = tasks.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(task => ({
        title: task.title,
        deadline: task.deadline,
        description: task.description
    }));
};
//generate 3 random tasks

//this is what the response from cohere looks like, i got this from docs, we really only need the response.message.content.text
interface ResponseFromCohere {
    id: string;
    message: {
        role: string;
        content: {
            type: string;
            text: string;
        }[];
    };
    finish_reason: string;
    meta: {
        api_version: {
            version: string;
            is_experimental: boolean;
        };
        warnings: string[];
        billed_units: {
            input_tokens: number;
            output_tokens: number;
        };
        tokens: {
            input_tokens: number;
            output_tokens: number;
        };
    };
}
export async function generateText(task:Task): Promise<string> {
    const prompt: string = "Generate a priority score (1-3) for a task with title:"+ task.title + "description:" +task.description + "deadline:"+task.deadline + "based on its characteristics and existing tasks. **Tasks**:" + getRandomTasks(3) +"Respond with a single integer priority score (1-3)."; //add "give a short description of why you chose this" if you want a small description
    try {
        const response = await cohere.chat({
            model: 'command-r',
            messages: [{role:'user', content: prompt }],
            
        });

        return response.message.content[0].text; //since content is an array, we need to get the first element, 
        //which is the text and type, then we do .text to get the text
    } catch (error) {
        console.error('Error generating text:', error);
       
        return ''; // Return an empty string or handle the error as needed
    }
}

