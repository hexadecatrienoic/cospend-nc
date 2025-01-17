<template>
	<AppNavigation>
		<template slot="list">
			<AppNavigationNewItem v-if="!pageIsPublic && !loading"
				class="addProjectItem"
				icon="icon-add"
				:title="t('cospend', 'New project')"
				:edit-placeholder="t('cospend', 'New project name')"
				@new-item="$emit('create-project', $event)" />
			<h2 v-if="loading"
				class="icon-loading-small loading-icon" />
			<EmptyContent v-else-if="sortedProjectIds.length === 0"
				icon="icon-folder">
				{{ t('cospend', 'No projects yet') }}
			</EmptyContent>
			<AppNavigationProjectItem
				v-for="id in sortedProjectIds"
				:key="id"
				:project="projects[id]"
				:members="projects[id].members"
				:selected="id === selectedProjectId"
				:selected-member-id="selectedMemberId"
				:member-order="cospend.memberOrder"
				@project-clicked="onProjectClicked"
				@delete-project="onDeleteProject"
				@stats-clicked="onStatsClicked"
				@settle-clicked="onSettleClicked"
				@detail-clicked="onDetailClicked"
				@share-clicked="onShareClicked"
				@new-member-clicked="onNewMemberClicked"
				@member-edited="onMemberEdited"
				@member-click="$emit('member-click', id, $event)" />
		</template>
		<template slot="footer">
			<div id="app-settings">
				<div id="app-settings-header">
					<button class="settings-button" @click="showSettings">
						{{ t('cospend', 'Cospend settings') }}
					</button>
				</div>
			</div>
		</template>
	</AppNavigation>
</template>

<script>
import AppNavigationProjectItem from './AppNavigationProjectItem'

import cospend from '../state'
import * as constants from '../constants'
import { strcmp } from '../utils'

import ClickOutside from 'vue-click-outside'

import AppNavigation from '@nextcloud/vue/dist/Components/AppNavigation'
import EmptyContent from '@nextcloud/vue/dist/Components/EmptyContent'
import AppNavigationNewItem from '@nextcloud/vue/dist/Components/AppNavigationNewItem'

import { emit } from '@nextcloud/event-bus'

export default {
	name: 'CospendNavigation',
	components: {
		AppNavigationProjectItem,
		AppNavigation,
		EmptyContent,
		AppNavigationNewItem,
	},
	directives: {
		ClickOutside,
	},
	props: {
		projects: {
			type: Object,
			required: true,
		},
		selectedProjectId: {
			type: String,
			default: '',
		},
		selectedMemberId: {
			type: Number,
			default: null,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			opened: false,
			creating: false,
			cospend,
			pageIsPublic: cospend.pageIsPublic,
		}
	},
	computed: {
		sortedProjectIds() {
			if (this.cospend.sortOrder === 'name') {
				return Object.keys(this.projects).sort((a, b) => {
					return strcmp(this.projects[a].name, this.projects[b].name)
				})
			} else if (this.cospend.sortOrder === 'change') {
				return Object.keys(this.projects).sort((a, b) => {
					return this.projects[b].lastchanged - this.projects[a].lastchanged
				})
			} else {
				return Object.keys(this.projects)
			}
		},
		editionAccess() {
			return this.selectedProjectId && this.projects[this.selectedProjectId].myaccesslevel >= constants.ACCESS.PARTICIPANT
		},
	},
	beforeMount() {
	},
	methods: {
		showSettings() {
			emit('show-settings')
		},
		toggleMenu() {
			this.opened = !this.opened
		},
		closeMenu() {
			this.opened = false
		},
		onProjectClicked(projectid) {
			this.$emit('project-clicked', projectid)
		},
		onDeleteProject(projectid) {
			this.$emit('delete-project', projectid)
		},
		onStatsClicked(projectid) {
			this.$emit('stats-clicked', projectid)
		},
		onSettleClicked(projectid) {
			this.$emit('settle-clicked', projectid)
		},
		onDetailClicked(projectid) {
			this.$emit('detail-clicked', projectid)
		},
		onShareClicked(projectid) {
			this.$emit('share-clicked', projectid)
		},
		onNewMemberClicked(projectid) {
			this.$emit('new-member-clicked', projectid)
		},
		onMemberEdited(projectid, memberid) {
			this.$emit('member-edited', projectid, memberid)
		},
	},
}
</script>
<style scoped lang="scss">
.addProjectItem {
	position: sticky;
	top: 0;
	z-index: 1000;
	border-bottom: 1px solid var(--color-border);
	background-color: var(--color-main-background);
	&:hover {
		background-color: var(--color-background-hover);
	}
}

::v-deep .selectedproject,
::v-deep .selectedmember {
	> a,
	> div {
		background: var(--color-background-dark, lightgrey);
	}

	> a {
		font-weight: bold;
	}
}

#app-settings-content {
	p {
		margin-top: 20px;
		margin-bottom: 20px;
		color: var(--color-text-light);
	}
}

.project-create {
	order: 1;
	display: flex;
	height: 44px;
	form {
		display: flex;
		flex-grow: 1;
		input[type='text'] {
			flex-grow: 1;
		}
	}
}

.buttonItem {
	border-bottom: solid 1px var(--color-border);
}

.loading-icon {
	margin-top: 16px;
}
</style>
