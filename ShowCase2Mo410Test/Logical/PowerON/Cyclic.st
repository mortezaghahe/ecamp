
PROGRAM _CYCLIC
	(* Insert code here *)
	TON_DelayDo1.PT := DelayOpc;
// Create Pulse Generator Start
	
	IF TON_DelayDo1.ET <> DelayOpc THEN
		TON_DelayDo1.IN := TRUE;
	END_IF
	
	TON_DelayDo1();
	gServoInitialized:= TON_DelayDo1.Q ;	
	
// Create Pulse Generator End

	

	
END_PROGRAM
