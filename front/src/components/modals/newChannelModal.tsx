import Button from '../button'
import { MdClose, MdGroupAdd } from 'react-icons/md'
import { NewChannelModalForm } from '@/styles/components/newChannelModal'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/services/api'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { ChatContext } from '@/contexts/ChatContext'
import { useContext } from 'react'
import ModalWithCloseOutside from './modalWithCloseOutside'

interface iNewChannelModal {
	showNewChannelModal: boolean
	setShowNewChannelModal: (state: boolean) => void
}

const newChannelSchema = z.discriminatedUnion(
	'type',
	[
		z.object({
			type: z.enum(['public', 'private']),
			name: z.string().min(1, '*Required'),
		}),
		z.object({
			type: z.enum(['protected']),
			name: z.string().min(1, '*Required'),
			password: z.string().min(1, '*Required'),
		}),
	],
	{
		errorMap: (issue, ctx) => {
			if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
				return { message: '*Select a value' }
			}
			return { message: ctx.defaultError }
		},
	},
)

type NewChannelSchema = z.infer<typeof newChannelSchema>

export default function NewChannelModal({
	showNewChannelModal,
	setShowNewChannelModal,
}: iNewChannelModal) {
	const router = useRouter()
	const { getChannelList } = useContext(ChatContext)

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<NewChannelSchema>({
		resolver: zodResolver(newChannelSchema),
	})

	function handleClose() {
		reset()
		setShowNewChannelModal(false)
	}

	async function handleCreateNewChannel(formData: NewChannelSchema) {
		try {
			const { data } = await api.post('/channel/create-channel', formData)
			await new Promise((resolve) => setTimeout(resolve, 500))
			getChannelList()
			reset()
			setShowNewChannelModal(false)
			router.push('/chat/' + data)
		} catch (error: any) {
			console.log('error:', error)
			toast(error.message ? error.message : error, {
				type: 'error',
			})
		}
	}

	const type = watch('type')

	return (
		<ModalWithCloseOutside
			isOpen={showNewChannelModal}
			setIsOpen={setShowNewChannelModal}
		>
			<NewChannelModalForm
				onSubmit={handleSubmit(handleCreateNewChannel)}
			>
				<h2>New Channel</h2>
				<div className="inputContainer">
					<select
						{...register('type')}
						className={errors.type ? 'hasError' : ''}
						defaultValue=""
					>
						<option value="public">Public</option>
						<option value="protected">Protected</option>
						<option value="private"> Private</option>
						<option value="" hidden>
							Channel Type
						</option>
					</select>
					{errors.type && <span>{errors.type.message}</span>}
				</div>

				<div className="inputContainer">
					<input
						type="text"
						className={errors.name ? 'hasError' : ''}
						placeholder="Channel Name"
						{...register('name')}
					/>
					{errors.name && <span>{errors.name.message}</span>}
				</div>
				{type === 'protected' && (
					<div className="inputContainer">
						<input
							type="text"
							className={
								(errors as any).password ? 'hasError' : ''
							}
							placeholder="Channel Password"
							{...register('password')}
						/>
						{(errors as any).password && (
							<span>{(errors as any).password.message}</span>
						)}
					</div>
				)}

				<div className="buttonsContainer">
					<Button
						type="button"
						buttonType="cancel"
						onClick={handleClose}
					>
						<MdClose size={40} />
						Cancel
					</Button>
					<Button
						type="submit"
						buttonType="accept"
						disabled={isSubmitting}
					>
						<MdGroupAdd size={40} />
						Create
					</Button>
				</div>
			</NewChannelModalForm>
		</ModalWithCloseOutside>
	)
}
