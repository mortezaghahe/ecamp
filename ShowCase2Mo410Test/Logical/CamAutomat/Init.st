

PROGRAM _INIT
	(* Insert code here *)
	Axis1.Exists := TRUE;
	gMpAxisBasicParType_AxisVirtu3.Position := 360.0;
	gMpAxisBasicParType_AxisVirtu3.Distance := 360.0;
	gMpAxisBasicParType_AxisVirtu3.Velocity := 360.0;
	gMpAxisBasicParType_AxisVirtu3.Deceleration := 1500;
	gMpAxisBasicParType_AxisVirtu3.Acceleration := 1500;
	gCouplingPar3.Cam.MasterScaling := 36000;
	gCouplingPar3.Cam.SlaveScaling := 36000;
	
END_PROGRAM