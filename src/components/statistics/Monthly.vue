<template>
	<div>
		<v-table
			class="monthlyTable coloredTable"
			:data="tableData">
			<thead slot="head">
				<v-th sort-key="name">
					{{ firstColumnTitle }}
				</v-th>
				<v-th v-for="month in distinctMonths"
					:key="month"
					:sort-key="month"
					:class="{ selected: selectedMonthlyCol === distinctMonths.indexOf(month) }">
					{{ month }}
				</v-th>
			</thead>
			<tbody slot="body" slot-scope="{displayData}">
				<tr v-for="vals in displayData"
					:key="vals.id"
					@mouseenter="selectedDataset = vals.id"
					@mouseleave="selectedDataset = null">
					<td :style="'border: 2px solid ' + vals.color + ';'">
						{{ vals.name }}
					</td>
					<td v-for="month in distinctMonths"
						:key="month"
						:class="{ selected: selectedMonthlyCol === distinctMonths.indexOf(month) }"
						:style="'border: 2px solid ' + vals.color + ';'">
						{{ (vals[month] || 0).toFixed(2) }}
					</td>
				</tr>
			</tbody>
		</v-table>
		<div id="categoryMonthlyChart"
			@mouseleave="selectedMonthlyCol = null">
			<LineChartJs
				:chart-data="myChartData"
				:options="chartOptions" />
		</div>
	</div>
</template>

<script>
import cospend from '../../state'
import LineChartJs from '../LineChartJs'

export default {
	name: 'Monthly',

	components: {
		LineChartJs,
	},

	props: {
		tableData: {
			type: Array,
			required: true,
		},
		chartData: {
			type: Object,
			required: true,
		},
		distinctMonths: {
			type: Array,
			required: true,
		},
		chartTitle: {
			type: String,
			required: true,
		},
		firstColumnTitle: {
			type: String,
			required: true,
		},
		baseLineChartOptions: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			cospend,
			loadingStats: false,
			selectedMonthlyCol: null,
			selectedDataset: null,
		}
	},

	computed: {
		chartOptions() {
			return {
				...this.baseLineChartOptions,
				title: {
					display: true,
					text: this.chartTitle,
				},
				onHover: this.onMonthlyChartHover,
			}
		},
		myChartData() {
			const datasets = this.chartData.datasets.map((ds) => {
				const datasetIsSelected = ds.id === this.selectedDataset || parseInt(ds.id) === this.selectedDataset
				return {
					...ds,
					order: datasetIsSelected ? -1 : undefined,
					borderWidth: datasetIsSelected ? 5 : 3,
					fill: datasetIsSelected ? 'origin' : undefined,
				}
			})
			return {
				labels: this.chartData.labels,
				datasets,
			}
		},
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		onMonthlyChartHover(event, data) {
			if (data.length > 0 && data[0]._index !== undefined) {
				this.selectedMonthlyCol = data[0]._index
			}
		},
	},
}
</script>

<style scoped lang="scss">
.monthlyTable {
	overflow: scroll;
	max-height: 500px;
	th {
		position: sticky;
		top: 0;
		z-index: 9;
		background-color: var(--color-main-background);
		&:first-child {
			left: 0;
			z-index: 10 !important;
		}
	}
	th:first-child,
	td:first-child {
		position: sticky;
		left: 0;
		z-index: 8;
		background-color: var(--color-main-background);
	}

	th.selected,
	td.selected {
		background-color: var(--color-background-dark);
	}
	td:first-child {
		padding: 0px 5px 0px 5px;
	}
}
</style>
