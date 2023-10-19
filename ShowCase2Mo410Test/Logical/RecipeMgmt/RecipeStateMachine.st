ACTION RecipeStateMachine: 
	
	CASE State OF
	//**************************************************LOAD**************
		LOAD:
			IF MpRecipeCsv_0.CommandDone THEN
				State := WAIT;
				uiLoad := FALSE;
			END_IF
	//**************************************************SAVE***************		
		SAVE:
			IF MpRecipeCsv_0.CommandDone THEN
				State := WAIT;
				uiSave := FALSE;
			END_IF
			
	//**************************************************WAIT***************		
		WAIT:
			IF (NOT MpRecipeCsv_0.CommandBusy AND uiLoad) THEN
				State := LOAD;
			END_IF
			IF (NOT MpRecipeCsv_0.CommandBusy AND uiSave) THEN
				State := SAVE;
			END_IF

	END_CASE
		
END_ACTION
