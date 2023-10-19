

PROGRAM _EXIT
	(* Insert code here *)
	gMpAxisBasic_Axis1.Enable 		:= FALSE;
	gMpAxisBasic_Axis1();
	gMpAxisBasic_AxisVirtu.Enable 		:= TRUE; 
	gMpAxisBasic_AxisVirtu();
	gMpAxisCoupling_0.Enable			:= FALSE;
	gMpAxisCoupling_0();
END_PROGRAM