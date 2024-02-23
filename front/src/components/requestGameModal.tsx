import { useContext } from 'react'
import Modal from './modal'
import Button from './button'
import { MdClose } from 'react-icons/md'
import { FaUserAstronaut, FaUserPlus } from 'react-icons/fa6'
import {
	RequestGameModalContainer,
	UserInfo,
} from '@/styles/components/requestGameModal'
import { GameContext } from '@/contexts/GameContext'

export default function RequestGameModal() {
	const { gameRequest, answerRequestMatch, resetGameRequest } =
		useContext(GameContext)

	function handleAcceptGame() {
		console.log('acceptGame')
		answerRequestMatch('accept')
	}

	function handleRefuseGame() {
		console.log('refuseGame')
		answerRequestMatch('refused')
	}

	return (
		<Modal isOpen={gameRequest && !!gameRequest?.username}>
			<RequestGameModalContainer>
				<UserInfo>
					<FaUserAstronaut className="icon" size={48} />
					<h2>{gameRequest?.username}</h2>
				</UserInfo>
				{gameRequest?.type === 'request' && (
					<h3> Invited you to a game.</h3>
				)}

				{gameRequest?.type === 'refused' && <h3> Refused to play.</h3>}

				{gameRequest?.type === 'request' && (
					<div className="buttonsContainer">
						<Button buttonType="cancel" onClick={handleRefuseGame}>
							<MdClose size={40} />
							Refuse
						</Button>
						<Button buttonType="accept" onClick={handleAcceptGame}>
							<FaUserPlus size={40} />
							Accept
						</Button>
					</div>
				)}
				{gameRequest?.type === 'refused' && (
					<div className="buttonsContainer">
						<Button buttonType="cancel" onClick={resetGameRequest}>
							<MdClose size={40} />
							Ok
						</Button>
					</div>
				)}
			</RequestGameModalContainer>
		</Modal>
	)
}
