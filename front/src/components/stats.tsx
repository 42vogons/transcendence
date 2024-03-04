/* eslint-disable camelcase */
import {
	TitleContainer,
	StatsContainer,
	StatsPanel,
	StatsPanelContainer,
} from '@/styles/components/stats'

import { FaGamepad } from 'react-icons/fa6'
import { IoStatsChartSharp } from 'react-icons/io5'
import { FaTrophy, FaPercent } from 'react-icons/fa'

export interface iStatsProps {
	total_games: number
	total_wins: number
}

export default function Stats({ total_games, total_wins }: iStatsProps) {
	return (
		<StatsContainer>
			<TitleContainer>
				<IoStatsChartSharp size={40} />
				<h2>Stats</h2>
			</TitleContainer>
			<StatsPanelContainer>
				<StatsPanel>
					<div>
						<FaGamepad size={40} />
						<h2>Games</h2>
					</div>
					<p>{total_games}</p>
				</StatsPanel>
				<StatsPanel>
					<div>
						<FaTrophy size={28} />
						<h2>Wins</h2>
					</div>
					<p>{total_wins}</p>
				</StatsPanel>
				<StatsPanel>
					<div>
						<FaPercent size={28} />
						<h2>Win</h2>
					</div>
					{total_games !== 0 ? (
						<p>{((100 * total_wins) / total_games).toFixed(2)}%</p>
					) : (
						<p>0%</p>
					)}
				</StatsPanel>
			</StatsPanelContainer>
		</StatsContainer>
	)
}
