/* eslint-disable camelcase */
import { ChatContext } from '@/contexts/ChatContext'
import { ChatInputContainer } from '@/styles/components/ChatInput'
import { FormEvent, useContext, useState } from 'react'
import { MdSend } from 'react-icons/md'

interface ChatInputProps {
	channel_id: number
}

export default function ChatInput({ channel_id }: ChatInputProps) {
	const { sendMessageToChannel } = useContext(ChatContext)
	const [content, setContent] = useState('')

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		// console.log(e)
		// console.log('channel_id:', channel_id)
		// console.log(content)
		sendMessageToChannel(channel_id, content)
		setContent('')
	}
	return (
		<ChatInputContainer onSubmit={(e) => handleSubmit(e)}>
			<input
				type="text"
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<button disabled={!content}>
				<MdSend size={48} />
			</button>
		</ChatInputContainer>
	)
}
