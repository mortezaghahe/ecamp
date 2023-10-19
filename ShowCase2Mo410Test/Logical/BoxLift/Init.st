

PROGRAM _INIT
	(* Insert code here *)
	
	
	// load parameter first time
	UserConvTopVelocity       	    := gSiPhysics[gSpeedRefHmi].UserConvTopVelocity   ;   // Load Speed the Conv Top
	UserConvBottomVelocity		    := gSiPhysics[gSpeedRefHmi].UserConvBottomVelocity;   // Load Speed the Conv Top
	UserConvLiftVelocity			:= gSiPhysics[gSpeedRefHmi].UserConvLiftVelocity ; // Load Speed the Conv Lift
	UserOutfeedConvVelocity 		:= gSiPhysics[gSpeedRefHmi].UserOutfeedConvVelocity; // Load Speed outfeed Conv 
	UserInfeedConvTopVelocity 		:= gSiPhysics[gSpeedRefHmi].UserInfeedConvTopVelocity; // Load Speed the Infeed Conv Top
	UserInfeedConvBottomVelocity 	:= gSiPhysics[gSpeedRefHmi].UserInfeedConvBottomVelocity; // Load Speed the Infeed Conv Bottom
	UserTopBoxReleaseTime 			:= gSiPhysics[gSpeedRefHmi].UserTopBoxReleaseTime;  //Load Release Speed
	UserBottomBoxReleaseTime 		:= gSiPhysics[gSpeedRefHmi].UserBottomBoxReleaseTime; //Load Release Speed
	gReceiptChanged					:= FALSE;
	aoConvTopVelocity 				:= 0.0;   // Turn off the Conv Top
	aoInfeedConvTopVelocity 		:= 0.0; // Turn off the Infeed Conv Top
	aoConvLiftVelocity 				:= 0.0; // Turn off the Conv Lift
	aoInfeedConvBottomVelocity 		:= 0.0; // Turn off the Infeed Conv Bottom
	aoOutfeedConvVelocity 			:= 0.0; // Turn off outfeed Conv 
	aoConvBottomVelocity  			:= 0.0;   // Turn off the Conv Top
	doLiftUnload 					:= FALSE;  //Lift Unload Position Cmd 
	doLiftTop 						:= FALSE; //Lift Top Position Cmd 
	doLiftBottom 					:= FALSE; //Lift Bottom Position Cmd 
	doConvTop 						:= FALSE; //Top Conveyor Run Cmd 
	doConvLift 						:= FALSE; //Lift Conveyor Run Cmd 
	doConvBottom 					:= FALSE; //Bottom Conveyor Run
	/// STOP Animation
	gDispalyStop 					:= TRUE; 	// Dispaly Stop Image
	gDispalyRun 					:= FALSE;   // Not Dispaly Run Image
	gDispalyAlarm 					:=FALSE;  // Not Dispaly Alarm Image
	gUserStop 						:= FALSE; 

	
END_PROGRAM