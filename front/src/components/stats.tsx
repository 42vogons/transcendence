import {
	TitleContainer,
	StatsContainer,
	StatsPanel,
	StatsPanelContainer,
} from '@/styles/components/stats'

import { FaGamepad } from 'react-icons/fa6'
import { IoStatsChartSharp } from 'react-icons/io5'
import { FaTrophy, FaPercent } from 'react-icons/fa'

export interface StatsProps {
	stats: {
		gamesPlayed: number
		wins: number
	}
}

export default function Stats({ stats }: StatsProps) {
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
					<p>{stats.gamesPlayed}</p>
				</StatsPanel>
				<StatsPanel>
					<div>
						<FaTrophy size={28} />
						<h2>Wins</h2>
					</div>
					<p>{stats.wins}</p>
				</StatsPanel>
				<StatsPanel>
					<div>
						<FaPercent size={28} />
						<h2>Win</h2>
					</div>
					<p>{(100 * stats.wins) / stats.gamesPlayed}%</p>
				</StatsPanel>
			</StatsPanelContainer>
		</StatsContainer>
	)
}
