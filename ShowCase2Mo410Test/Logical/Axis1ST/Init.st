

PROGRAM _INIT
	(* Insert code here *)
	gMpAxisBasicParType_Axis2.AutoTune.Mode 				:= mcAXIS_TUNE_AUTOMATIC;
	gMpAxisBasicParType_Axis2.AutoTune.MaxCurrentPercent 	:= 80.0;
	gMpAxisBasicParType_Axis2.AutoTune.MaxDistance 			:= 10;
	gMpAxisBasicParType_Axis2.AutoTune.MaxPositionError 	:= 30;

	gMpAxisBasicParType_Axis1.AutoTune.Mode 				:= mcAXIS_TUNE_AUTOMATIC;
	gMpAxisBasicParType_Axis1.AutoTune.MaxCurrentPercent 	:= 80.0;
	gMpAxisBasicParType_Axis1.AutoTune.MaxDistance 			:= 10;
	gMpAxisBasicParType_Axis1.AutoTune.MaxPositionError 	:= 30;
	
	Axis1.Exists := TRUE;
	gMpAxisBasicParType_AxisVirtu.Position := 360.0;
	gMpAxisBasicParType_AxisVirtu.Distance := 360.0;
	gMpAxisBasicParType_AxisVirtu.Velocity := 360.0;
	gMpAxisBasicParType_AxisVirtu.Deceleration := 1500;
	gMpAxisBasicParType_AxisVirtu.Acceleration := 1500;
	gCouplingPar.Cam.MasterScaling := 36000;
	gCouplingPar.Cam.SlaveScaling := 36000;
	
	
END_PROGRAM