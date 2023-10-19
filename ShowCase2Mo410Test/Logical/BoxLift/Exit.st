

PROGRAM _EXIT
	(* Insert code here *)
	 // 
	aoConvTopVelocity 			:= 0.0;   	// Turn off the Conv Top
	aoInfeedConvTopVelocity  	:= 0.0; 	// Turn off the Infeed Conv Top
	aoConvLiftVelocity 			:= 0.0; 	// Turn off the Conv Lift
	aoInfeedConvBottomVelocity 	:= 0.0; 	// Turn off the Infeed Conv Bottom
	aoOutfeedConvVelocity 		:= 0.0; 	// Turn off outfeed Conv 
	aoConvBottomVelocity  		:= 0.0;  	 // Turn off the Conv Top
	doLiftUnload 				:= FALSE; 	 //Lift Unload Position Cmd 
	doLiftTop 					:= FALSE; 	//Lift Top Position Cmd 
	doLiftBottom 				:= FALSE; //Lift Bottom Position Cmd 
	doConvTop 					:= FALSE; //Top Conveyor Run Cmd 
	doConvLift 					:= FALSE; //Lift Conveyor Run Cmd 
	doConvBottom 				:= FALSE; //Bottom Conveyor Run
	
END_PROGRAM