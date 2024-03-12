/* eslint-disable camelcase */
import Button from '../button'
import { MdClose, MdGroupAdd } from 'react-icons/md'
import { NewChannelModalForm } from '@/styles/components/newChannelModal'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/services/api'
import { toast } from 'react-toastify'
import { ChatContext } from '@/contexts/ChatContext'
import { useContext, useEffect } from 'react'
import ModalWithCloseOutside from './modalWithCloseOutside'
import { delayMs } from '@/utils/functions'

interface iUpdateChannelModal {
	showUpdateChannelModal: boolean
	setShowUpdateChannelModal: (state: boolean) => void
	channel_id: number
	channel_name: string
	channel_type: 'public' | 'private' | 'protected'
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
			password: z
				.string()
				.min(6, 'The password must contain at least 6 character(s)')
				.refine((pwd) => /[0-9]/.test(pwd), {
					message: 'The password must have a number.',
				})
				.refine((pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), {
					message: 'The password must have a special character.',
				})
				.refine((pwd) => /[A-Z]/.test(pwd), {
					message: 'The password must have an Upper case letter.',
				}),
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

export default function UpdateChannelModal({
	showUpdateChannelModal,
	setShowUpdateChannelModal,
	channel_id,
	channel_name,
	channel_type,
}: iUpdateChannelModal) {
	const { getChannelList, getChannelMessages } = useContext(ChatContext)

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<NewChannelSchema>({
		resolver: zodResolver(newChannelSchema),
	})

	function handleClose() {
		reset()
		setShowUpdateChannelModal(false)
	}

	async function handleUpdateChannel(formData: NewChannelSchema) {
		try {
			await api.patch(`/channel/${channel_id}`, formData)
			await delayMs(500)
			getChannelList()
			getChannelMessages(channel_id)
			reset()
			setShowUpdateChannelModal(false)
			toast('Channel updated.', {
				type: 'info',
			})
		} catch (error: any) {
			console.log('error:', error)
			toast(error.message ? error.message : error, {
				type: 'error',
			})
		}
	}

	const type = watch('type')

	useEffect(() => {
		if (showUpdateChannelModal) {
			setValue('name', channel_name)
			setValue('type', channel_type)
		}
	}, [channel_name, channel_type, setValue, showUpdateChannelModal])

	return (
		<ModalWithCloseOutside
			isOpen={showUpdateChannelModal}
			setIsOpen={setShowUpdateChannelModal}
		>
			<NewChannelModalForm onSubmit={handleSubmit(handleUpdateChannel)}>
				<h2>Update Channel</h2>
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
