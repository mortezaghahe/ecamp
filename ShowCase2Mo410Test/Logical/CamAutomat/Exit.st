

PROGRAM _EXIT
	(* Insert code here *)
	gMpAxisBasic_Axis3.Enable 		:= FALSE;
	gMpAxisBasic_Axis3();
	gMpAxisBasic_AxisVirtu3.Enable 		:= TRUE; 
	gMpAxisBasic_AxisVirtu3();
	gMpAxisCoupling_3.Enable			:= FALSE;
	gMpAxisCoupling_3();
END_PROGRAM