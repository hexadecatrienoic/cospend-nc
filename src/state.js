/* jshint esversion: 6 */

import * as constants from './constants'

const cospend = {
	restoredCurrentProjectId: null,
	urlProjectId: null,
	currentProjectId: null,
	currentBill: null,
	memberEditionMode: null,
	projectEditionMode: null,
	projectDeletionTimer: {},
	shareDeletionTimer: {},
	billDeletionTimer: {},
	currencyDeletionTimer: {},
	categoryDeletionTimer: {},
	// indexed by projectid, then by billid
	bills: {},
	billLists: {},
	// indexed by projectid, then by memberid
	members: {},
	projects: {},
	hardCodedCategories: constants.hardCodedCategories,
	hardCodedPaymentModes: constants.hardCodedPaymentModes,
	paymentModes: constants.paymentModes,
	memberOrder: 'name',
	useTime: true,
	activity_enabled: false,
}

export default cospend
