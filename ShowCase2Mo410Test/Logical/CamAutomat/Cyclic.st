
PROGRAM _CYCLIC
	(* Insert code here *)
	 
	gMpAxisBasic_Axis3.MpLink 			:= ADR(gAxis3_MpLink); 
	gMpAxisBasic_Axis3.Enable 			:= TRUE; 
	gMpAxisBasic_Axis3.Parameters 		:= ADR(gMpAxisBasicParType_Axis3);

	gMpAxisBasic_AxisVirtu3.MpLink 		:= ADR(gAxisV3_MpLink); 
	gMpAxisBasic_AxisVirtu3.Enable 		:= TRUE; 
	gMpAxisBasic_AxisVirtu3.Parameters 	:= ADR(gMpAxisBasicParType_AxisVirtu3);
	
	gMpAxisCoupling_3.MpLink 			:= ADR(gAxis3_MpLink);
	gMpAxisCoupling_3.MpLinkMaster 		:= ADR(gAxisV3_MpLink);

	gCouplingPar3.Cam.ID				:= 1;
	gMpAxisCoupling_3.Parameters		:= ADR(gCouplingPar3);
	




	
	CASE AxisStep OF
		
		STATE_WAIT :     //**************** 00000 ************************** STATE_WAIT ********************* 0000 ********************* STATE_WAIT
			gMpAxisBasic_Axis3.Power		:= FALSE;
			gMpAxisBasic_AxisVirtu3.Power	:= FALSE;
			gMpAxisCoupling_3.Enable 	:= FALSE;
			IF (Axis3.Exists AND NOT gMpAxisCoupling_3.Active AND gServoInitialized) THEN
				AxisStep :=  STATE_POWER_ON;
			END_IF
			
		
		STATE_POWER_ON : //************************ 1 ****************** STATE_POWER_ON ********************* 1 ********************* STATE_POWER_ON
			gMpAxisBasic_Axis3.Power		:= TRUE;
			gMpAxisBasic_AxisVirtu3.Power	:= TRUE;
			IF (gMpAxisBasic_Axis3.PowerOn = TRUE AND gMpAxisBasic_AxisVirtu3.PowerOn = TRUE  ) THEN
				Axis1Home		:= FALSE;
				Axis2Home		:= FALSE;
				AxisStep := STATE_HOME;
					
			END_IF
			
			IF (gMpAxisBasic_Axis3.Error OR gMpAxisBasic_Axis3.Error) THEN
				Axis3_ErrorID := 1;
				AxisStep := STATE_ERROR;
			END_IF
			
			
		STATE_HOME :  //***************************** 2 ********************STATE_HOME************************* 2 *********************STATE_HOME
			
			Axis3.statusHomed 				:= FALSE;
			IF NOT gMpAxisCoupling_3.Active THEN
				gMpAxisBasic_Axis3.Home 		:= TRUE;
				gMpAxisBasicParType_Axis3.Homing.Mode 		:= mcHOMING_DIRECT;
				gMpAxisBasicParType_Axis3.Homing.Position 	:= 0.0;
				gMpAxisBasic_AxisVirtu3.Home 		:= TRUE;
				gMpAxisBasicParType_AxisVirtu3.Homing.Mode 		:= mcHOMING_DIRECT;
				gMpAxisBasicParType_AxisVirtu3.Homing.Position 	:= 0.0;
			END_IF		
			
			IF EDGEPOS(gMpAxisBasic_Axis3.IsHomed) THEN
				Axis1Home		:= TRUE;
			END_IF		
			IF EDGEPOS(gMpAxisBasic_AxisVirtu3.IsHomed) THEN
				Axis2Home		:= TRUE;
			END_IF	
		
			IF (Axis1Home AND Axis2Home   ) THEN
				Axis3.statusHomed 			:= 1;
				gMpAxisBasic_Axis3.Home 	:= FALSE;
				gMpAxisBasic_AxisVirtu3.Home := FALSE;
				gMpAxisCoupling_3.Enable 	:= TRUE;
				AxisStep := STATE_READY;
			END_IF		
			
			IF (gMpAxisBasic_Axis3.Error) THEN
				Axis3_ErrorID := 2;
				AxisStep := STATE_ERROR;
			END_IF
			
		STATE_READY : //***************************** 10 ************************ STATE_READY ******************** 10 ************************** STATE_READY 
			
			Axis3.statusStarting :=0;
			IF (Axis3.cmdHome = 1 )THEN
				Axis1Home					:= FALSE;
				Axis2Home					:= FALSE;
				Axis3.cmdHome		 		:= FALSE;
				gMpAxisCoupling_3.Enable	:= FALSE;
				gMpAxisCoupling_3.Cam 		:= FALSE;
				AxisStep 				:= STATE_HOME;
			ELSIF (Axis3.cmdStop = 1) THEN
				gMpAxisCoupling_3.Cam 		:= FALSE;
				AxisStep 				:= STATE_WAIT;
				Axis3.cmdStop 			:= FALSE;
			ELSIF (Axis3.cmdManualForward  AND gMpAxisCoupling_3.Active) THEN
				gMpAxisCoupling_3.Cam 	:=TRUE;
				AxisStep := STATE_JOG;	
			END_IF	
		
			IF gMpAxisBasic_Axis3.Error THEN
				AxisStep := STATE_ERROR;
			END_IF
			
				
		STATE_STOP : //*********************** 11 ****************************** STATE_STOP ***************************** 11 ********************** STATE_STOP 
			
			gMpAxisBasic_AxisVirtu3.Stop := TRUE;
			(* if axis is stopped go to state wait *)
			IF (gMpAxisBasic_AxisVirtu3.Stopped = 1  ) THEN
				gMpAxisBasic_AxisVirtu3.Stop := 0;
				AxisStep := STATE_READY;
			END_IF
			(* check if error occured *)
			IF (gMpAxisBasic_Axis3.Error ) THEN
				Axis3_ErrorID := 3;
				AxisStep := STATE_ERROR;
			END_IF
			
			
		
		STATE_JOG : //************************* 17 **************************** STATE_JOG ********************************* 17 ********************* STATE_JOG 

			IF ( Axis3.cmdManualForward  AND gMpAxisCoupling_3.InSync) THEN
				gMpAxisBasic_AxisVirtu3.MoveAdditive:= TRUE;
			END_IF		
			
			IF NOT(Axis3.cmdManualForward ) THEN
				gMpAxisBasic_AxisVirtu3.MoveAdditive:= FALSE;
				//				Axis1Home					:= FALSE;
				//				Axis2Home					:= FALSE;
				//				Axis3.cmdHome		 		:= FALSE;
				IF (NOT gMpAxisBasic_AxisVirtu3.CommandBusy AND NOT gMpAxisBasic_Axis3.CommandBusy) THEN		
					AxisStep 				:= STATE_READY;
					//					gMpAxisCoupling_1.Enable	:= FALSE;
					//					gMpAxisCoupling_1.Cam 		:= FALSE;
				END_IF	
				//				AxisStep := STATE_READY;
			END_IF

			(* check if error occured *)
			IF (gMpAxisBasic_Axis3.Error OR gMpAxisBasic_Axis3.Error) THEN
				Axis3_ErrorID := 4;
				AxisStep := STATE_ERROR;
			END_IF			
				
		STATE_ERROR : //********************** 101 ******************************* STATE_ERROR **************************** 101 ********************** STATE_ERROR 

			Axis3.statusStarting 		:=0;
			Axis3.statusFaulted 		:= TRUE;
			gMpAxisCoupling_3.Gear 		:= FALSE;
			gMpAxisCoupling_3.Cam 		:= FALSE;
			gMpAxisBasic_Axis3.Power 	:= FALSE;
			gMpAxisBasic_Axis3.Home 	:= FALSE;
			gMpAxisBasic_Axis3.Stop 	:= FALSE;
			gMpAxisBasic_AxisVirtu3.Power 		:= FALSE;
			gMpAxisBasic_AxisVirtu3.Home 		:= FALSE;
			gMpAxisBasic_AxisVirtu3.Stop 		:= FALSE;
			gMpAxisBasic_Axis3.MoveAbsolute 	:= FALSE;
			gMpAxisBasic_AxisVirtu3.MoveVelocity := FALSE;
			gMpAxisBasic_AxisVirtu3.MoveAbsolute := FALSE;
			gMpAxisBasic_AxisVirtu3.MoveVelocity := FALSE;
			gMpAxisBasic_Axis3.ErrorReset 		:= TRUE;
			gMpAxisBasic_AxisVirtu3.ErrorReset 	:= TRUE;
			gMpAxisCoupling_3.ErrorReset   		:= TRUE;
					
			IF (NOT(gMpAxisBasic_Axis3.Error ) AND NOT(gMpAxisBasic_AxisVirtu3.Error )) THEN
				Axis3.statusFaulted:=FALSE;
				gMpAxisBasic_Axis3.ErrorReset 		:= FALSE;
				gMpAxisBasic_AxisVirtu3.ErrorReset 	:= FALSE;
				gMpAxisCoupling_3.ErrorReset   		:= FALSE;
				AxisStep := STATE_WAIT;
				Axis3.statusErrorID := 0;
			END_IF
			
	END_CASE

	
	gMpAxisBasic_Axis3();
	gMpAxisBasic_Axis2();
	gMpAxisBasic_AxisVirtu3();
	gMpAxisCoupling_3();
	
	Axis3.cmdManualForward 	:= gActivateMotion;
	
END_PROGRAM
