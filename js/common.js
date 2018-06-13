function initBaseData(base) {
	if (!base.seeCount) {
		// base.seeCount = 10;
	}
	$("#patentCount").html(base.totalCount + "次");
	$("#seeCount").html(base.seeCount + "次");
	$("#transCount").html(base.transCount + "次");
}

function showtishi() {
	alert('此功能正在开发中，下一个版本将会上线！')
}