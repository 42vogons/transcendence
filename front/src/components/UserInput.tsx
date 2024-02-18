import { UserInputContainer } from '@/styles/components/UserInput'
import { FaUserAstronaut } from 'react-icons/fa6'

interface iUserInputProps {
	userInput: string
	setUserInput: (value: string) => void
}

export default function UserInput({
	userInput,
	setUserInput,
}: iUserInputProps) {
	return (
		<UserInputContainer>
			<FaUserAstronaut className="icon" size={32} />
			<input
				id="userInput"
				type="string"
				maxLength={8}
				onChange={(e) => setUserInput(e.target.value)}
				value={userInput}
			/>
		</UserInputContainer>
	)
}
