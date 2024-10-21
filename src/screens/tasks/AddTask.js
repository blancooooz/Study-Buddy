import React, { useState } from 'react';
import {View, TextInput, Button, Text, CheckBox,} from 'react-native';
import { useDispatch } from 'react-redux';
import { add_task } from '../../redux/actions';

const AddTask = () => {
    const [task, setTask] = useState({
        title: '',
        deadline: '',
        description: '',
        tags: [],
        id: '',
        recurring: false,
        priority: 0,
        completed: false,
        time_due: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        multi_step: false,
        sub_tasks: [],
        collaborative: false,
        users: [],
        reminder: {
            enabled: false,
            reminder_time: '',
        },
        attachments: [],
        subject: {
            name: '',
            color: '',
        },
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(add_task(task));
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Title"
                name="title"
                value={task.title}
                onChangeText={(text) => handleChange({ target: { name: 'title', value: text } })}
            />
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Deadline"
                name="deadline"
                value={task.deadline}
                onChangeText={(text) => handleChange({ target: { name: 'deadline', value: text } })}
            />
            <TextInput
                style={{ height: 80, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Description"
                name="description"
                value={task.description}
                onChangeText={(text) => handleChange({ target: { name: 'description', value: text } })}
                multiline
            />
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Tags (comma separated)"
                name="tags"
                value={task.tags.join(', ')}
                onChangeText={(text) => handleChange({ target: { name: 'tags', value: text.split(', ') } })}
            />
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="ID"
                name="id"
                value={task.id}
                onChangeText={(text) => handleChange({ target: { name: 'id', value: text } })}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <CheckBox
                    value={task.recurring}
                    onValueChange={(value) => handleChange({ target: { name: 'recurring', value, type: 'checkbox' } })}
                />
                <Text>Recurring</Text>
            </View>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Priority"
                name="priority"
                value={String(task.priority)}
                onChangeText={(text) => handleChange({ target: { name: 'priority', value: text } })}
                keyboardType="numeric"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <CheckBox
                    value={task.completed}
                    onValueChange={(value) => handleChange({ target: { name: 'completed', value, type: 'checkbox' } })}
                />
                <Text>Completed</Text>
            </View>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Time Due"
                name="time_due"
                value={task.time_due}
                onChangeText={(text) => handleChange({ target: { name: 'time_due', value: text } })}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <CheckBox
                    value={task.multi_step}
                    onValueChange={(value) => handleChange({ target: { name: 'multi_step', value, type: 'checkbox' } })}
                />
                <Text>Multi-step</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <CheckBox
                    value={task.collaborative}
                    onValueChange={(value) => handleChange({ target: { name: 'collaborative', value, type: 'checkbox' } })}
                />
                <Text>Collaborative</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <CheckBox
                    value={task.reminder.enabled}
                    onValueChange={(value) => handleChange({ target: { name: 'reminder.enabled', value, type: 'checkbox' } })}
                />
                <Text>Reminder Enabled</Text>
            </View>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Reminder Time"
                name="reminder.reminder_time"
                value={task.reminder.reminder_time}
                onChangeText={(text) => handleChange({ target: { name: 'reminder.reminder_time', value: text } })}
            />
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Subject Name"
                name="subject.name"
                value={task.subject.name}
                onChangeText={(text) => handleChange({ target: { name: 'subject.name', value: text } })}
            />
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                placeholder="Subject Color"
                name="subject.color"
                value={task.subject.color}
                onChangeText={(text) => handleChange({ target: { name: 'subject.color', value: text } })}
            />
            <Button title="Add Task" onPress={handleSubmit} />
        </View>
    );
};

export default AddTask;