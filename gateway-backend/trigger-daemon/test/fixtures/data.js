var fixtures = {
    temperature_greater_than_80: {"sensor_id": "temperature", "value": "80.54047151375562", "timestamp":"1438015679772"},
    valid_data_1: {"sensor_id": "1", "value": "74.54047151375562", "timestamp":"1438015679772"},
    valid_data_2: {"sensor_id": "2", "value": "65.22398894652724", "timestamp":"1438015679772"},
    empty_sensor_reading: {"sensor_id": "1", "value": "", "timestamp":"1438015681778"},
    invalid_sensor_reading: {"sensor_id": "1", "value": "abcde", "timestamp":"1438015681778"},
    invalid_timestamp: {"sensor_id": "1", "value": "71.36048490181565", "timestamp":"abcde"},
    empty_timestamp: {"sensor_id": "1", "value": "71.36048490181565", "timestamp":""},
    invalid_sensor_id: {"sensor_id": "=---", "value": "83.30243791919202", "timestamp":"1438015683780"},
    empty_sensor_id: {"sensor_id": "", "value": "83.30243791919202", "timestamp":"1438015683780"}
};

module.exports = fixtures;