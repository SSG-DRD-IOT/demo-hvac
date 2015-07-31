var fixtures = {
    valid_data_1: {"sensor_id": "sensor_1", "value": "74.54047151375562", "timestamp":"1438015679772"},
    valid_data_2: {"sensor_id": "sensor_2", "value": "65.22398894652724", "timestamp":"1438015679772"},
    invalid_sensor_reading: {"sensor_id": "sensor_1", "value": "", "timestamp":"1438015681778"},
    invalid_timestamp: {"sensor_id": "sensor_1", "value": "71.36048490181565", "timestamp":""},
    invalid_sensor_id: {"sensor_id": "", "value": "83.30243791919202", "timestamp":"1438015683780"}
};

modules.exports = fixtures;
