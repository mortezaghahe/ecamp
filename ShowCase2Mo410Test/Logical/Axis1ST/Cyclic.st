
PROGRAM _CYCLIC
	(* Insert code here *)
	 
	gMpAxisBasic_Axis1.MpLink 			:= ADR(gAxis1_MpLink); 
	gMpAxisBasic_Axis1.Enable 			:= TRUE; 
	gMpAxisBasic_Axis1.Parameters 		:= ADR(gMpAxisBasicParType_Axis1);

	gMpAxisBasic_AxisVirtu.MpLink 		:= ADR(gAxisV_MpLink); 
	gMpAxisBasic_AxisVirtu.Enable 		:= TRUE; 
	gMpAxisBasic_AxisVirtu.Parameters 	:= ADR(gMpAxisBasicParType_AxisVirtu);
	
	gMpAxisCoupling_0.MpLink 			:= ADR(gAxis1_MpLink);
	gMpAxisCoupling_0.MpLinkMaster 		:= ADR(gAxisV_MpLink);

	gCouplingPar.Cam.ID					:= 1;
	gMpAxisCoupling_0.Parameters		:= ADR(gCouplingPar);
	




	
	CASE AxisStep OF
		
		STATE_WAIT :     //**************** 00000 ************************** STATE_WAIT ********************* 0000 ********************* STATE_WAIT
			gMpAxisBasic_Axis1.Power		:= FALSE;
			gMpAxisBasic_AxisVirtu.Power	:= FALSE;
			gMpAxisCoupling_0.Enable 	:= FALSE;
			IF (Axis1.Exists AND NOT gMpAxisCoupling_0.Active AND gServoInitialized) THEN
				AxisStep :=  STATE_POWER_ON;
			END_IF
			
		
		STATE_POWER_ON : //************************ 1 ****************** STATE_POWER_ON ********************* 1 ********************* STATE_POWER_ON
				gMpAxisBasic_Axis1.Power		:= TRUE;
				gMpAxisBasic_AxisVirtu.Power	:= TRUE;
			IF (gMpAxisBasic_Axis1.PowerOn = TRUE AND gMpAxisBasic_AxisVirtu.PowerOn = TRUE  ) THEN
					Axis1Home		:= FALSE;
					Axis2Home		:= FALSE;
					AxisStep := STATE_HOME;
					
     		END_IF
			
			IF (gMpAxisBasic_Axis1.Error OR gMpAxisBasic_Axis2.Error) THEN
				Axis1_ErrorID := 1;
				AxisStep := STATE_ERROR;
			END_IF
			
			
		STATE_HOME :  //***************************** 2 ********************STATE_HOME************************* 2 *********************STATE_HOME
			
			Axis1.statusHomed 				:= FALSE;
			IF NOT gMpAxisCoupling_0.Active THEN
			gMpAxisBasic_Axis1.Home 		:= TRUE;
				gMpAxisBasicParType_Axis1.Homing.Mode 		:= mcHOMING_DIRECT;
				gMpAxisBasicParType_Axis1.Homing.Position 	:= 0.0;
				gMpAxisBasic_AxisVirtu.Home 		:= TRUE;
				gMpAxisBasicParType_AxisVirtu.Homing.Mode 		:= mcHOMING_DIRECT;
				gMpAxisBasicParType_AxisVirtu.Homing.Position 	:= 0.0;
			END_IF		
			
			IF EDGEPOS(gMpAxisBasic_Axis1.IsHomed) THEN
				Axis1Home		:= TRUE;
			END_IF		
			IF EDGEPOS(gMpAxisBasic_AxisVirtu.IsHomed) THEN
				Axis2Home		:= TRUE;
			END_IF	
		
			IF (Axis1Home AND Axis2Home   ) THEN
				Axis1.statusHomed 			:= 1;
				gMpAxisBasic_Axis1.Home 	:= FALSE;
				gMpAxisBasic_AxisVirtu.Home := FALSE;
				gMpAxisCoupling_0.Enable 	:= TRUE;
				AxisStep := STATE_READY;
			END_IF		
			
			IF (gMpAxisBasic_Axis1.Error) THEN
				Axis1_ErrorID := 2;
				AxisStep := STATE_ERROR;
			END_IF
			
		STATE_READY : //***************************** 10 ************************ STATE_READY ******************** 10 ************************** STATE_READY 
			
			Axis1.statusStarting :=0;
			IF (Axis1.cmdHome = 1 )THEN
				Axis1Home					:= FALSE;
				Axis2Home					:= FALSE;
				Axis1.cmdHome		 		:= FALSE;
				gMpAxisCoupling_0.Enable	:= FALSE;
				gMpAxisCoupling_0.Cam 		:= FALSE;
				AxisStep 				:= STATE_HOME;
			ELSIF (Axis1.cmdStop = 1) THEN
				gMpAxisCoupling_0.Cam 		:= FALSE;
				AxisStep 				:= STATE_WAIT;
				Axis1.cmdStop 			:= FALSE;
			ELSIF (Axis1.cmdManualForward  AND gMpAxisCoupling_0.Active) THEN
				gMpAxisCoupling_0.Cam 	:=TRUE;
				AxisStep := STATE_JOG;	
			END_IF	
		
			IF gMpAxisBasic_Axis1.Error THEN
				AxisStep := STATE_ERROR;
			END_IF
			
				
		STATE_STOP : //*********************** 11 ****************************** STATE_STOP ***************************** 11 ********************** STATE_STOP 
			
			gMpAxisBasic_AxisVirtu.Stop := TRUE;
			(* if axis is stopped go to state wait *)
			IF (gMpAxisBasic_AxisVirtu.Stopped = 1  ) THEN
				gMpAxisBasic_AxisVirtu.Stop := 0;
				AxisStep := STATE_READY;
			END_IF
			(* check if error occured *)
			IF (gMpAxisBasic_Axis1.Error ) THEN
				Axis1_ErrorID := 3;
				AxisStep := STATE_ERROR;
			END_IF
			
			
		
		STATE_JOG : //************************* 17 **************************** STATE_JOG ********************************* 17 ********************* STATE_JOG 

			IF ( Axis1.cmdManualForward  AND gMpAxisCoupling_0.InSync) THEN
				gMpAxisBasic_AxisVirtu.MoveAdditive:= TRUE;
			END_IF		
			
			IF NOT(Axis1.cmdManualForward ) THEN
				gMpAxisBasic_AxisVirtu.MoveAdditive:= FALSE;
//				Axis1Home					:= FALSE;
//				Axis2Home					:= FALSE;
//				Axis1.cmdHome		 		:= FALSE;
				IF (NOT gMpAxisBasic_AxisVirtu.CommandBusy AND NOT gMpAxisBasic_Axis1.CommandBusy) THEN		
					AxisStep 				:= STATE_READY;
//					gMpAxisCoupling_0.Enable	:= FALSE;
//					gMpAxisCoupling_0.Cam 		:= FALSE;
				END_IF	
//				AxisStep := STATE_READY;
			END_IF

			(* check if error occured *)
			IF (gMpAxisBasic_Axis1.Error OR gMpAxisBasic_Axis2.Error) THEN
				Axis1_ErrorID := 4;
				AxisStep := STATE_ERROR;
			END_IF			
				
		STATE_ERROR : //********************** 101 ******************************* STATE_ERROR **************************** 101 ********************** STATE_ERROR 

			Axis1.statusStarting 		:=0;
			Axis1.statusFaulted 		:= TRUE;
			gMpAxisCoupling_0.Gear 		:= FALSE;
			gMpAxisCoupling_0.Cam 		:= FALSE;
			gMpAxisBasic_Axis1.Power 	:= FALSE;
			gMpAxisBasic_Axis1.Home 	:= FALSE;
			gMpAxisBasic_Axis1.Stop 	:= FALSE;
			gMpAxisBasic_AxisVirtu.Power 		:= FALSE;
			gMpAxisBasic_AxisVirtu.Home 		:= FALSE;
			gMpAxisBasic_AxisVirtu.Stop 		:= FALSE;
			gMpAxisBasic_Axis1.MoveAbsolute 	:= FALSE;
			gMpAxisBasic_AxisVirtu.MoveVelocity := FALSE;
			gMpAxisBasic_AxisVirtu.MoveAbsolute := FALSE;
			gMpAxisBasic_AxisVirtu.MoveVelocity := FALSE;
			gMpAxisBasic_Axis1.ErrorReset 		:= TRUE;
			gMpAxisBasic_AxisVirtu.ErrorReset 	:= TRUE;
			gMpAxisCoupling_0.ErrorReset   		:= TRUE;
					
			IF (NOT(gMpAxisBasic_Axis1.Error ) AND NOT(gMpAxisBasic_AxisVirtu.Error )) THEN
				Axis1.statusFaulted:=FALSE;
				gMpAxisBasic_Axis1.ErrorReset 		:= FALSE;
				gMpAxisBasic_AxisVirtu.ErrorReset 	:= FALSE;
				gMpAxisCoupling_0.ErrorReset   		:= FALSE;
				AxisStep := STATE_WAIT;
				Axis1.statusErrorID := 0;
			END_IF
			
	END_CASE

	
	gMpAxisBasic_Axis1();
	gMpAxisBasic_Axis2();
	gMpAxisBasic_AxisVirtu();
	gMpAxisCoupling_0();
	
	Axis1.cmdManualForward 	:= gActivateMotion;
	
END_PROGRAM
