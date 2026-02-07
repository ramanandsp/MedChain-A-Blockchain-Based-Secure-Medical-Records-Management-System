// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedChainV2 {
    address public admin;

    struct Record {
        string ipfsHash;
        string recordType;
        string note;
        address addedBy;
        uint256 timestamp;
    }

    struct Patient {
        bool exists;
        Record[] records;
    }

    mapping(address => bool) public doctors;
    mapping(address => Patient) private patients;

    event DoctorAdded(address doctor);
    event PatientRegistered(address patient, address doctor);
    event RecordAdded(address patient, address doctor, string ipfsHash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyDoctor() {
        require(doctors[msg.sender], "Only doctor");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addDoctor(address _doctor) external onlyAdmin {
        doctors[_doctor] = true;
        emit DoctorAdded(_doctor);
    }

    function registerPatient(address _patient) external onlyDoctor {
        require(!patients[_patient].exists, "Patient already registered");
        patients[_patient].exists = true;
        emit PatientRegistered(_patient, msg.sender);
    }

    function addRecord(address _patient, string memory _ipfsHash, string memory _type, string memory _note) external onlyDoctor {
        require(patients[_patient].exists, "Patient not found");
        patients[_patient].records.push(Record(_ipfsHash, _type, _note, msg.sender, block.timestamp));
        emit RecordAdded(_patient, msg.sender, _ipfsHash);
    }

    function getRecords(address _patient) external view returns (Record[] memory) {
        require(patients[_patient].exists, "No patient data");
        return patients[_patient].records;
    }
}
