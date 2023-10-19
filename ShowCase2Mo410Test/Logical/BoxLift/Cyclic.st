
PROGRAM _CYCLIC

	CASE State OF
		
		STOP:  //***********************STOP**********************************************STOP********************************************STOP
			aoConvTopVelocity 			:= 0.0;   	// Turn off the Conv Top
			aoInfeedConvTopVelocity  	:= 0.0; 	// Turn off the Infeed Conv Top
			aoConvLiftVelocity 			:= 0.0; 	// Turn off the Conv Lift
			aoInfeedConvBottomVelocity 	:= 0.0; 	// Turn off the Infeed Conv Bottom
			aoOutfeedConvVelocity 		:= 0.0; 	// Turn off outfeed Conv 
			aoConvBottomVelocity  		:= 0.0;   // Turn off the Conv Top
			aoTopBoxReleaseTime         := 100;  		//Box Release Speed
			aoBottomBoxReleaseTime      := 100; 	//Box Release Speed
			doLiftUnload 				:= FALSE; //Lift Unload Position Cmd 
			doLiftTop 					:= FALSE; //Lift Top Position Cmd 
			doLiftBottom 				:= FALSE; //Lift Bottom Position Cmd 
			doConvTop 					:= FALSE; //Top Conveyor Run Cmd 
			doConvLift 					:= FALSE; //Lift Conveyor Run Cmd 
			doConvBottom 				:= FALSE; //Bottom Conveyor Run
			/// STOP Animation
			gDispalyStop 	:= TRUE; 	// Dispaly Stop Image
			gDispalyRun 	:= FALSE;   // Not Dispaly Run Image
			gDispalyAlarm 	:=FALSE;  	// Not Dispaly Alarm Image
			gUserStop 		:= FALSE;
			gUserReset 		:= FALSE;
			BoxIsPassed 	:= FALSE; 
			i:=9;
			IF gUserStart THEN 
				State := MAKE;
				gUserStart := FALSE;
									
			END_IF
			IF NOT gServoInitialized THEN 
				State := INIT;
									
			END_IF
			
		MAKE:  //**************** MAKE *********************************************** MAKE ********************************************************************* MAKE
			
			/// RUN Animation	
			gDispalyRun 		:= TRUE;    //Dispaly Run Image
			gDispalyStop		:= FALSE; 	// Dispaly Stop Image
			gDispalyAlarm 		:=FALSE;  	// Not Dispaly Alarm Image	
			/// RUN Animation
			doConvTop    		:= NOT diConvTop;   	// Run the Top Conv
			doConvLift   		:= ( NOT diBoxLift OR BoxIsPassed);   	// Run the Lift Conv
			doConvBottom 		:= NOT diConvBottom; 	// Run the bottom conv 
			
			CounterJamInfeed.RESET := TRUE;
			CounterJamInfeed();
			
			aoConvTopVelocity           := UserConvTopVelocity;   		// Set Speed the Conv Top
			aoConvBottomVelocity        := UserConvBottomVelocity;   	// Set Speed the Conv Top
			aoConvLiftVelocity          := UserConvLiftVelocity ; 		// Set Speed the Conv Lift
			aoOutfeedConvVelocity       := UserOutfeedConvVelocity; 	// Set Speed outfeed Conv 
			aoInfeedConvTopVelocity     := UserInfeedConvTopVelocity ; 		// Set Speed the Infeed Conv Top
			aoInfeedConvBottomVelocity  := UserInfeedConvBottomVelocity; 	// Set Speed the Infeed Conv Bottom
			aoTopBoxReleaseTime         := UserTopBoxReleaseTime;  		//Box Release Speed
			aoBottomBoxReleaseTime      := UserBottomBoxReleaseTime; 	//Box Release Speed
			

			
		

						
			IF (diConvBottom AND NOT diConvTop AND NOT diBoxLift AND NOT BoxIsPassed ) THEN   // Sensor at the edge of the bottom conveyor detected with no box on the unload conv 
				doConvBottom	:= FALSE; // Stop the bottom conv 
				State 			:= LOWER;
			END_IF
			
			IF (diConvTop AND diConvBottom AND NOT MemoUpperDischarge AND NOT diBoxLift AND NOT BoxIsPassed) THEN   // Sensor at the edge of the bottom conveyor detected with no box on the unload conv Prio given to
				doConvTop    		:= FALSE;   // Stop the Top Conv
				MemoUpperDischarge 	:= TRUE; 
				State := UPPER;			
			ELSIF ( diConvTop AND diConvBottom AND MemoUpperDischarge AND NOT diBoxLift AND NOT BoxIsPassed)  THEN   // Sensor at the edge of the bottom conveyor detected with no box on the unload conv  Prio given to
				doConvBottom 		:= FALSE; // Stop the bottom conv 
				MemoUpperDischarge 	:= FALSE;
				State := LOWER;
			END_IF
			
			IF (diConvTop AND NOT diConvBottom AND NOT diBoxLift AND NOT BoxIsPassed) THEN // Sensor at the edge of the top conveyor detected with no box on the unload conv 
				doConvTop   := FALSE;   // Stop the Top Conv
				State 		:= UPPER;
			END_IF
			IF diBoxLift OR BoxIsPassed THEN  // Sensor at the center of the unload conveyor detected
				doConvLift  := BoxIsPassed;   // Stop the Lift Conv
				BoxIsPassed := FALSE;
				State 		:= UNLOAD;   // Change the state to UnLoad
			END_IF
			TimerCommErrorIphysic.IN := NOT gComTCPSimActive ;  // Detect communication Error iPhysic
			TimerCommErrorIphysic();
			IF TimerCommErrorIphysic.Q THEN //Infeed Jam Lower code
				ErrorID 		:= 6;  //Infeed Jam Lower Error
				State 			:= ERROR;
				gDispalyNoComm 	:= TRUE;
			END_IF
			
			IF gUserStop THEN 
				gUserStop := FALSE;
				State := STOP;
			END_IF	
						
			
		LOWER: //**************** LOWER *********************************************** LOWER ********************************************************************* LOWER
						
			doLiftBottom    := TRUE; //Move the lift conv to Bottom pos
			doConvTop    	:= NOT diConvTop ;   // Stop the Top Conv
			CounterJamInfeed.RESET 	:= FALSE;
			CounterJamInfeed.CU 	:= diConvBottomFilter.Q; // Count jammed box
			CounterJamInfeed();
			IF CounterJamInfeed.Q THEN
				ErrorID := 1;  //Infeed Jam Lower Error
				State 	:= ERROR;
			END_IF
			
			TimerLowerSensorBlock.IN := diConvBottom AND doConvBottom ;  // Detect sensor block if the conv run
			TimerLowerSensorBlock();
			
			IF TimerLowerSensorBlock.Q THEN //Infeed Jam Lower code
				ErrorID := 5;  //Infeed Jam Lower Error
				State 	:= ERROR;
			END_IF
			
			IF diBoxLiftFilter.Q AND NOT diLiftBottomFilter.Q  THEN //Error Extra Box on Lift Conveyor
				ErrorID := 7;  //Error Extra Box on Lift Conveyor
				State 	:= ERROR;
			END_IF
	
			IF diLiftBottom THEN  // Sensor at the Bottom pos 
				doConvBottom  	:= TRUE;  // Run the Bottom Conv
				doConvLift     	:= TRUE; //Run the uload Con	
			END_IF
			BoxIsPassed := diBoxLiftTON.Q; 
			
			IF diLiftBottom AND ( diBoxLift OR diBoxLiftTON.Q)  AND NOT CounterJamInfeed.Q THEN  // Sensor at the outfeed of the unload conveyor detected 
				doConvBottom  	 := FALSE; 	// Stop the Lift Conv
				doLiftBottom	 := FALSE;  //Move the lift conv to unload
				doConvLift       := BoxIsPassed; 	//Stop the uload Con	
				State := MAKE;   // Change the state to UnLoad
			END_IF
			IF gUserReset THEN   // RESET Procedure
				gUserReset 	:= FALSE;
				State 		:= STOP;
			END_IF	
		UPPER:  //**************** UPPER *********************************************** UPPER ********************************************************************* UPPER
			
			doLiftTop     := TRUE; //Move the lift conv to Bottom pos
					
			doConvBottom := NOT diConvBottom; // Stop the bottom conv 
			CounterJamInfeed.RESET 	:= FALSE;	
			CounterJamInfeed.CU 	:= diConvTopFilter.Q; // Count jammed box
			CounterJamInfeed();
			IF CounterJamInfeed.Q THEN //Infeed Jam Lower code
			     ErrorID 	:= 2;  //Infeed Jam Lower Error
		 	     State 		:= ERROR;
			END_IF
			TimerUpperSensorBlock.IN :=diConvTop AND doConvTop;  // Detect sensor block if the conv run
			TimerUpperSensorBlock();
			IF TimerUpperSensorBlock.Q THEN //Infeed Jam Lower code
				ErrorID 	:= 4;  //Infeed Jam Lower Error
				State 		:= ERROR;
			END_IF
			IF diBoxLiftFilter.Q AND NOT diLiftTopFilter.Q  THEN //Error Extra Box on Lift Conveyor
				ErrorID := 7;  //Error Extra Box on Lift Conveyor
				State 	:= ERROR;
			END_IF
				
			IF diLiftTop THEN  // Sensor at the Bottom pos 
				doConvTop  	 := TRUE;  // Run the Bottom Conv
				doConvLift   := TRUE; //Run the uload Con		
			END_IF
			BoxIsPassed := diBoxLiftTON.Q; 
			IF diLiftTop AND ( diBoxLift OR diBoxLiftTON.Q) AND NOT CounterJamInfeed.Q THEN  // Sensor at the outfeed of the unload conveyor detected 
				doConvTop  	 := FALSE; 	// Stop the Lift Conv
				doLiftTop	 := FALSE;  //Move the lift conv to unload
				doConvLift   := BoxIsPassed; //Stop the uload Con	
				State := MAKE;   		// Change the state to UnLoad
			END_IF
			IF gUserReset THEN   // RESET Procedure
				gUserReset 	:= FALSE;
				State 		:= STOP;
			END_IF	
		UNLOAD:  //**************** UNLOAD *********************************************** UNLOAD ********************************************************************* UNLOAD

			gActivateMotion := TRUE;
			doLiftUnload	 := TRUE;  //Move the lift conv to unload
			aoConvLiftVelocity		:= UserConvLiftVelocity +  ( gMpAxisBasic_Axis1.Velocity / 1000.0 * gSpeedFactor);

			CounterJamInfeed.RESET 	:= FALSE;
			CounterJamInfeed.CU 	:= EDGENEG(diBoxLiftFilter.Q); // Extra box on conv lift
			CounterJamInfeed();
			IF CounterJamInfeed.Q THEN
				ErrorID := 7;  //Extra box on conv lift
				State 	:= ERROR;
			END_IF
			
			doConvTop    := NOT diConvTop ;   // Stop the Top Conv
			doConvBottom := NOT diConvBottom; // Stop the bottom conv 
			
			
			IF ( diLiftUnload OR Test_Bit_0) THEN  // Sensor at the center of the unload conveyor detected 
				doConvLift  	 := TRUE;  // Run the Lift Conv
			END_IF
			
			IF diUnloaded AND diLiftUnload THEN  // Sensor at the outfeed of the unload conveyor detected 
				doConvLift  	 := FALSE; // Stop the Lift Conv
				doLiftUnload	 := FALSE;  //Move the lift conv to unload 
				gActivateMotion := FALSE;
				State := MAKE;   // Change the state to UnLoad
			END_IF
			
			IF gUserReset THEN   // RESET Procedure
				gUserReset := FALSE;
				State := STOP;
			END_IF	
			
		ERROR: //**************** ERROR *********************************************** ERROR ********************************************************************* ERROR
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
			//Alarm Image	
			gDispalyAlarm 				:= gDisplayBlink;	//Dispaly Alarm Image		
			gDispalyStop 				:= TRUE; 	// Dispaly Stop Image		
			gDispalyRun 				:= FALSE;   // Not Dispaly Run Image
			SaveAlarm 					:= TRUE;
			
			IF i<>0 THEN
				gErrorTime[i] 		:= gErrorTime[i-1];  // Shift Error Time
				gErrorDes[i] 		:= gErrorDes[i-1];    // Shift Error Description	
				ErrorTimeString[i] := ErrorTimeString[i-1]; //To dispaly in mappView
				i := i-1;
			END_IF
			IF i=0 THEN
				CopyDone := TRUE;
			END_IF		
			IF SaveAlarm AND EDGEPOS(CopyDone) THEN 			
				gErrorDes[0] 		:= ErrorTable[ErrorID]; // Save Current Error
				DTGetTime_0.enable 	:= TRUE;
				DTGetTime_0();
				gErrorTime[0]:=DTGetTime_0.DT1;  // Save Current Time
				ErrorTimeString[0] 	:= DT_TO_STRING(gErrorTime[0]); //To dispaly in mappView
			END_IF
			
			IF gUserReset THEN   // RESET Procedure
				gUserReset 			:= FALSE; // Reset Request disable
				DTGetTime_0.enable	:=FALSE; // Function save time Request disable
				SaveAlarm 			:= FALSE;  // Saving Finish
				CopyDone 			:= FALSE;  //Copy previous alarm Done
				ErrorID 			:= 0;  //Infeed Jam Lower Error
				gDispalyNoComm 		:= FALSE; // Disaply off for communication error
				State 				:= STOP;
				i:=9;
			END_IF
			
		INIT:				
			
			IF  gServoInitialized THEN 
				State := STOP;				
			END_IF
		
	END_CASE //*********************************************************************** END CASE
			

	

	/// Recepit Management ********************************************************Recepit Management**************************************************************************************

	IF  gReceiptChanged THEN
		 UserConvTopVelocity       	    := gSiPhysics[gSpeedRefHmi].UserConvTopVelocity   ;   // Load Speed the Conv Top
		 UserConvBottomVelocity		    := gSiPhysics[gSpeedRefHmi].UserConvBottomVelocity;   // Load Speed the Conv Top
		 UserConvLiftVelocity			:= gSiPhysics[gSpeedRefHmi].UserConvLiftVelocity ; // Load Speed the Conv Lift
		 UserOutfeedConvVelocity 		:= gSiPhysics[gSpeedRefHmi].UserOutfeedConvVelocity; // Load Speed outfeed Conv 
		 UserInfeedConvTopVelocity 		:= gSiPhysics[gSpeedRefHmi].UserInfeedConvTopVelocity; // Load Speed the Infeed Conv Top
		 UserInfeedConvBottomVelocity 	:= gSiPhysics[gSpeedRefHmi].UserInfeedConvBottomVelocity; // Load Speed the Infeed Conv Bottom
		 UserTopBoxReleaseTime 			:= gSiPhysics[gSpeedRefHmi].UserTopBoxReleaseTime;  //Load Release Speed
	     UserBottomBoxReleaseTime 		:= gSiPhysics[gSpeedRefHmi].UserBottomBoxReleaseTime; //Load Release Speed
		 gReceiptChanged := FALSE;
	END_IF
		
	IF gSaveParameter THEN
		gSiPhysics[gSpeedRefHmi].UserConvTopVelocity       	    := UserConvTopVelocity   ;   // Set Speed the Conv Top
		gSiPhysics[gSpeedRefHmi].UserConvBottomVelocity		    := UserConvBottomVelocity;   // Set Speed the Conv Top
		gSiPhysics[gSpeedRefHmi].UserConvLiftVelocity			:= UserConvLiftVelocity ; // Set Speed the Conv Lift
		gSiPhysics[gSpeedRefHmi].UserOutfeedConvVelocity 		:= UserOutfeedConvVelocity; // Set Speed outfeed Conv 
		gSiPhysics[gSpeedRefHmi].UserInfeedConvTopVelocity 		:= UserInfeedConvTopVelocity; // Set Speed the Infeed Conv Top
		gSiPhysics[gSpeedRefHmi].UserInfeedConvBottomVelocity 	:= UserInfeedConvBottomVelocity; // Set Speed the Infeed Conv Bottom
		gSiPhysics[gSpeedRefHmi].UserTopBoxReleaseTime 			:= UserTopBoxReleaseTime;  //Box Release Speed
		gSiPhysics[gSpeedRefHmi].UserBottomBoxReleaseTime 		:= UserBottomBoxReleaseTime; //Box Release Speed
		gSaveParameter := FALSE;
	END_IF
	
	SpeedInfoText := SpeedInfoTextTable[gSpeedRefHmi];  // Dispaly speed info
	
	
	// Information Dispaly **********************************************Information Dispaly************************************************************************************************
	gBoxCountUnload.CU 		:= diUnloaded;  // Count Unloaded Box
	gBoxCountUnload.RESET 	:= ResetCount; // Reset from Dispaly
	gBoxCountUnload();
	BoxCountUnloadDis 		:= gBoxCountUnload.CV ; // Dispaly Count
	
	StatusDispaly 			:= StatusDispalyDefault[State];  // Dispaly Status on the main page
	StatusDispalyTopContent := StatusDispalyTopContentDefault[State];// Dispaly Status on the top page
	
	
	// Find Box per minutes
	oneMinTimer.IN := TRUE;
	oneMinTimer();
	IF EDGEPOS(oneMinTimer.Q) THEN
		oneMinTimer.IN := FALSE;
		oneMinTimer();
		TotalBoxUnloaded := gBoxCountUnload.CV - PrevBoxCountUnload;  // how maney box uloaded last 10s
		PrevBoxCountUnload :=gBoxCountUnload.CV;
		Performance := TotalBoxUnloaded*6; // how maney box uloaded last 60s
		IF Performance > gSiPhysics[gSpeedRefHmi].MaximumUloadedBox THEN  // Save only if the new value is greater than the previous to keep the maximum
			gSiPhysics[gSpeedRefHmi].MaximumUloadedBox := Performance;
		END_IF
	END_IF
	// Dispaly XY Chart
	DispalyGraph[0]:= 1;  // for X0 chart
	DispalyGraph[1]:= 2;  // for X1 chart
	DispalyGraph[2]:= 3;  // for X2 chart
	TotalBoxUnloadedPerSpeed[0] := gSiPhysics[0].MaximumUloadedBox  ;  // how maney box uloaded last 10s per Low speed
	TotalBoxUnloadedPerSpeed[1] := gSiPhysics[1].MaximumUloadedBox  ;  // how maney box uloaded last 10s per Medium speed
	TotalBoxUnloadedPerSpeed[2] := gSiPhysics[2].MaximumUloadedBox  ;  // how maney box uloaded last 10s per High speed
	// Dispaly Bar Chart
	TotalBoxUnloadedPerSpeedLow  	 := gSiPhysics[0].MaximumUloadedBox;  // how maney box uloaded last 10s per Low speed
	TotalBoxUnloadedPerSpeedMeduim	 := gSiPhysics[1].MaximumUloadedBox;  // how maney box uloaded last 10s per Medium speed
	TotalBoxUnloadedPerSpeedHigh	 := gSiPhysics[2].MaximumUloadedBox;  // how maney box uloaded last 10s per High speed
	
	// di Sensors noise filter

	diBoxLiftFilter.IN := diBoxLift;    //di Sensors noise filter
	diBoxLiftFilter();
	
	diLiftTopFilter.IN := diLiftTop; //di Sensors noise filter
	diLiftTopFilter();
	
	diLiftBottomFilter.IN := diLiftBottom; //di Sensors noise filter
	diLiftBottomFilter();
	
	diConvBottomFilter.IN := diConvBottom; //di Sensors noise filter
	diConvBottomFilter();
	
	diConvTopFilter.IN := diConvTop; //di Sensors noise filter
	diConvTopFilter();
	
	// if doConvTop doConvLift then we can assume the box is in the begging of the conv lift
	diBoxLiftTON.IN := ((doConvLift AND doConvTop AND State = UPPER ) OR (doConvLift AND doConvBottom AND State = LOWER))  ;
	diBoxLiftTON();
		
	
END_PROGRAM

