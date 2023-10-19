
TYPE
	iPhysicParam_typ : 	STRUCT 
		UserOutfeedConvVelocity : REAL := 1.0; (*OutfeedConv Velocity Speed ref*)
		UserInfeedConvTopVelocity : REAL := 0.6; (* InfeedConvTop Velocity Speed ref*)
		UserInfeedConvBottomVelocity : REAL := 0.5; (*InfeedConvBottom Velocity Speed ref*)
		UserConvTopVelocity : REAL := 1.0; (* ConvTop VelocitySpeed ref*)
		UserConvLiftVelocity : REAL := 1.0; (* ConvLift Velocity Speed ref*)
		UserConvBottomVelocity : REAL := 1.0; (* Conv Bottom Velocity Speed ref*)
		UserTopBoxReleaseTime : REAL := 25.0;
		UserBottomBoxReleaseTime : REAL := 20.0;
		BlockSensorLowerConvTime : TIME := T#500ms;
		BlockSensorUpperConvTime : TIME := T#500ms;
		MaximumUloadedBox : REAL := 0.0; (*Maximum unloaded box at each speed*)
	END_STRUCT;
	Axis_type : 	STRUCT 
		Exists : BOOL;
		name : STRING[10]; (*Name of the axis*)
		cmdReset : BOOL; (*cmd from HMI to reset any fault*)
		cmdStart : BOOL; (*cmd to start this axis *)
		cmdCam : BOOL;
		cmdGear : BOOL;
		cmdStop : BOOL; (*cmd to stop this axis*)
		cmdHome : BOOL; (*cmd from HMI to home this axis*)
		cmdReference : BOOL; (*cmd from HMI to set the zero offset of the axis.*)
		cmdRun : BOOL; (*cmd to put axis into run state*)
		cmdOffset : BOOL;
		cmdJog : BOOL; (*cmd to put axis into jog state*)
		cmdManualForward : BOOL; (*cmd from HMI to put axis into manual forward state*)
		cmdManualReverse : BOOL; (*cmd from HMI to put axis into manual reverse state*)
		cmdMoveAbsolute : BOOL; (*cmd from control task to move axis to absolute position*)
		parmSpeed : REAL; (*cmded speed for manual moves*)
		parmAccelDecel : REAL; (*Acceleration and deceleration of absolute moves*)
		parmAbsolutePosition : REAL; (*Absolute position for absolute moves*)
		parmMaxTorque : REAL; (*Max torque when torque limiting is enabled*)
		statusOn : BOOL; (*Axis is powered on*)
		statusOff : BOOL; (*Axis is powered off*)
		statusDisabled : BOOL; (*Hardware disabled*)
		statusFaulted : BOOL; (*Axis is in the Faulted State*)
		statusStarting : BOOL; (*Axis is in the Starting State*)
		statusHoming : BOOL; (*Axis is in the Homing State*)
		statusInPosition : BOOL; (*Axis is in position following an absolute move*)
		statusRunning : BOOL; (*Axis is in the Running State*)
		statusJogging : BOOL; (*Axis is in the Jogging State*)
		statusMoving : BOOL; (*Axis velocity is > 0*)
		statusManualForward : BOOL; (*Axis is in the Manual Forward State*)
		statusManualReverse : BOOL; (*Axis is in the Manual Reverse State*)
		statusStopping : BOOL; (*Axis is in the Manual Stopping State*)
		statusHomed : BOOL; (*Axis has been homed*)
		statusPosition : LREAL; (*Axis position*)
		statusSpeed : REAL; (*Axis speed*)
		statusCurrent : REAL; (*Axis motor current *)
		statusLagError : REAL; (*Axis lag error*)
		statusTemperature : REAL; (*Actual Temperature*)
		statusTorque : REAL; (*Actual Torque*)
		statusMasterOffset : LREAL; (*Actual offset from master*)
		statusAbsMoveActive : BOOL; (*Absolute move is active*)
		statusGeared : BOOL; (*Axis is geared with the master*)
		statusPoweredOff : BOOL; (*Axis is powered OFF from the software*)
		statusStopped : BOOL; (*Axis has stopped moving*)
		statusPeakCurrent : REAL; (*Peak over the last few seconds motor current *)
		statusPeakLagError : REAL; (*Peak over the last few seconds lag error*)
		statusPeakTorque : REAL; (*Peak over the last few seconds Torque*)
		statusErrorID : UDINT; (*Axis ErrorID (0=no error)*)
		parmMaintMax : REAL;
		parmMaintMin : REAL;
		parmMax : REAL; (*Position to move to when cmded to park. (Real world units)*)
		parmMin : REAL; (*Position to move to when cmded to park. (Real world units)*)
		parmOperMax : REAL; (*Max position displayed on screen based on job setup and mechanical limits*)
		parmOperMin : REAL; (*Min position displayed on screen based on job setup and mechanical limits*)
		parmReferencePosition : REAL; (*Physical position when at the reference mark. (Real world units)*)
	END_STRUCT;
END_TYPE
