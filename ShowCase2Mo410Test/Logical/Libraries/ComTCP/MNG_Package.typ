(*                                                                            *)
(* File generated by the B&R AS 4 control config generator                    *)
(*                                                                            *)
(*     Provider: machineering                                                 *)
(*  Application: industrialPhysics_2.4.master                                 *)
(* Architecture: Windows 64 Bit                                               *)
(*      Version: 2.4.10898.master                                             *)
(*        Build: 46694f700                                                    *)
(*         Date: 2020-04-28, Time: 08:09:42                                   *)
(*                                                                            *)

TYPE
	ComTCP_INPUTS_32BIT : 	STRUCT 
		NumSignals : INT := 7;
		diUnloaded : BOOL := 0; (* BOOL diUnloaded *)
		diLiftUnload : BOOL := 0; (* BOOL diLiftUnload *)
		diLiftTop : BOOL := 0; (* BOOL diLiftTop *)
		diBoxLift : BOOL := 0; (* BOOL diBoxLift *)
		diLiftBottom : BOOL := 0; (* BOOL diLiftBottom *)
		diConvBottom : BOOL := 0; (* BOOL diConvBottom *)
		diConvTop : BOOL := 0; (* BOOL diConvTop *)
	END_STRUCT;
	ComTCP_OUTPUTS_32BIT : 	STRUCT 
		NumSignals : INT := 14;
		OutfeedConv_Velocity : REAL := 1; (* REAL OutfeedConv_Velocity *)
		doLiftTop : BOOL := 0; (* BOOL doLiftTop *)
		doLiftBottom : BOOL := 0; (* BOOL doLiftBottom *)
		doLiftUnload : BOOL := 0; (* BOOL doLiftUnload *)
		doConvLift : BOOL := 0; (* BOOL doConvLift *)
		ConvLift_Velocity : REAL := 1; (* REAL ConvLift_Velocity *)
		doConvBottom : BOOL := 0; (* BOOL doConvBottom *)
		ConvBottom_Velocity : REAL := 1; (* REAL ConvBottom_Velocity *)
		BottomBox_ReleaseTime : REAL := 25; (* LREAL BottomBox_ReleaseTime *)
		doConvTop : BOOL := 0; (* BOOL doConvTop *)
		ConvTop_Velocity : REAL := 1; (* REAL ConvTop_Velocity *)
		TopBox_ReleaseTime : REAL := 20; (* LREAL TopBox_ReleaseTime *)
		InfeedConvTop_Velocity : REAL := 0.6; (* REAL InfeedConvTop_Velocity *)
		InfeedConvBottom_Velocity : REAL := 0.5; (* REAL InfeedConvBottom_Velocity *)
	END_STRUCT;
END_TYPE
