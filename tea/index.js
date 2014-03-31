var Tea = function () {
	this.data = {
		number: null,
		name: null,
		origin: null,
		type: null,
		currentStock: null,
		arriving: null
	};

	this.fill = function (info) {
		for(var prop in this.data) {
			if(this.data[prop] !== 'undefined') {
				this.data[prop] = info[prop];
			}
		}
	};

	this.triggerArriving = function () {
		this.data.arriving = Date.now();
	};

	this.getInformation = function () {
		return this.data;
	};
};

module.exports = function (info) {
	var instance = new Tea();

	instance.fill(info);

	return instance;
};