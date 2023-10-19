
PROGRAM _CYCLIC
	(* Insert code here *)
	TON_DelayDo1.PT := DelayBlink;
// Create Pulse Generator Start
	
	IF TON_DelayDo1.ET <> DelayBlink THEN
		TON_DelayDo1.IN := TRUE;
	END_IF
	
	TON_DelayDo1();
		
	IF EDGEPOS(TON_DelayDo1.Q) THEN
		gDisplayBlink := NOT gDisplayBlink; 
		TON_DelayDo1.IN := FALSE;
	END_IF
	
// Create Pulse Generator End


	
END_PROGRAM
