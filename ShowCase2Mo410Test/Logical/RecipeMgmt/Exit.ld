PROGRAM _EXIT
<?xml version="1.0"?>
<?AutomationStudio FileVersion="4.9"?>
<!-- Automation Studio Generated XML Section -->
<networks maxcolumn="0">
	<network label="" comment="" row="12" column="0" commented="0">
		<row>
			<empty/>
			<empty/>
			<functionblock position="header" name="MpRecipeCsv_0" type="MpRecipeCsv"/>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<contact type="address" name="gRecipeCsv_CFG"/>
			<functionblock position="top" type="MpRecipeCsv"><input name="MpLink" vardynamic="true"/><output name="Active"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<analog type="input" name="FALSE"/>
			<functionblock position="middle" type="MpRecipeCsv"><input name="Enable"/><output name="Error"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<empty/>
			<functionblock position="middle" type="MpRecipeCsv"><input name="ErrorReset"/><output name="StatusID"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<contact type="address" name="sDeviceName"/>
			<functionblock position="middle" type="MpRecipeCsv"><input name="DeviceName" vardynamic="true"/><output name="CommandBusy"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<contact type="address" name="sFileName"/>
			<functionblock position="middle" type="MpRecipeCsv"><input name="FileName" vardynamic="true"/><output name="CommandDone"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<empty/>
			<functionblock position="middle" type="MpRecipeCsv"><input name="Header" vardynamic="true"/><output name="Info"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<empty/>
			<functionblock position="middle" type="MpRecipeCsv"><input name="Category" vardynamic="true"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<empty/>
			<functionblock position="middle" type="MpRecipeCsv"><input name="LoadType"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<empty/>
			<functionblock position="middle" type="MpRecipeCsv"><input name="Load"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<empty/>
			<functionblock position="middle" type="MpRecipeCsv"><input name="Save"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<empty/>
			<functionblock position="bottom" type="MpRecipeCsv"><input name="UpdateNotification"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
	</network>
	<network label="" comment="" row="6" column="0" commented="0">
		<row>
			<empty/>
			<empty/>
			<functionblock position="header" name="MpRecipeRegPar_0" type="MpRecipeRegPar"/>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<contact type="address" name="gRecipeCsv_CFG"/>
			<functionblock position="top" type="MpRecipeRegPar"><input name="MpLink" vardynamic="true"/><output name="Active"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<analog type="input" name="FALSE"/>
			<functionblock position="middle" type="MpRecipeRegPar"><input name="Enable"/><output name="Error"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<empty/>
			<functionblock position="middle" type="MpRecipeRegPar"><input name="ErrorReset"/><output name="StatusID"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<contact type="address" name="sVariableName"/>
			<functionblock position="middle" type="MpRecipeRegPar"><input name="PVName" vardynamic="true"/><output name="UpdateNotification"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
		<row>
			<empty/>
			<empty/>
			<functionblock position="bottom" type="MpRecipeRegPar"><input name="Category" vardynamic="true"/><output name="Info"/></functionblock>
			<empty/>
			<empty/>
			<empty/>
		</row>
	</network>
	<network label="" comment="" row="1" column="0" commented="0">
		<row>
			<empty/>
			<empty/>
			<empty/>
			<empty/>
			<empty/>
			<empty/>
			<empty/>
		</row>
	</network>
</networks>
END_PROGRAM

