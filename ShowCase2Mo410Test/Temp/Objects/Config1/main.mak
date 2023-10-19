SHELL := cmd.exe
CYGWIN=nontsec
export PATH := C:\windows\system32;C:\windows;C:\windows\System32\Wbem;C:\windows\System32\WindowsPowerShell\v1.0\;C:\Program Files (x86)\IBM\Client Access\Emulator;C:\Program Files (x86)\IBM\Client Access\Shared;C:\Program Files (x86)\IBM\Client Access\;C:\Program Files (x86)\NVIDIA Corporation\PhysX\Common;C:\Program Files (x86)\Common Files\Rockwell;C:\Program Files (x86)\Rockwell Software\;C:\Program Files (x86)\Common Files\Rockwell\;C:\Program Files (x86)\Rockwell Software\RSCommon;C:\Program Files (x86)\Rockwell Automation\Common\Components;C:\Program Files\dotnet\;C:\Program Files (x86)\Windows Kits\10\Windows Performance Toolkit\;C:\Program Files (x86)\Microsoft SQL Server\150\DTS\Binn\;C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn\;C:\Program Files (x86)\Microsoft SQL Server\150\Tools\Binn\;C:\Program Files\Microsoft SQL Server\150\Tools\Binn\;C:\Program Files\Microsoft SQL Server\150\DTS\Binn\;C:\Program Files\Azure Data Studio\bin;C:\Users\shahmoradM\AppData\Local\Microsoft\WindowsApps;C:\Users\shahmoradM\AppData\Local\Programs\Git\cmd;C:\Program Files (x86)\Common Files\Hilscher GmbH\TLRDecode;C:\Users\shahmoradM\AppData\Local\Microsoft\WindowsApps;C:\Users\shahmoradM\AppData\Local\Programs\Git\cmd;C:\Program Files (x86)\Common Files\Hilscher GmbH\TLRDecode;C:\BrAutomation\AS410\bin-en\4.10;C:\BrAutomation\AS410\bin-en\4.9;C:\BrAutomation\AS410\bin-en\4.8;C:\BrAutomation\AS410\bin-en\4.7;C:\BrAutomation\AS410\bin-en\4.6;C:\BrAutomation\AS410\bin-en\4.5;C:\BrAutomation\AS410\bin-en\4.4;C:\BrAutomation\AS410\bin-en\4.3;C:\BrAutomation\AS410\bin-en\4.2;C:\BrAutomation\AS410\bin-en\4.1;C:\BrAutomation\AS410\bin-en\4.0;C:\BrAutomation\AS410\bin-en
export AS_BUILD_MODE := Build
export AS_VERSION := 4.10.5.38 SP
export AS_WORKINGVERSION := 4.10
export AS_COMPANY_NAME := Barry-Wehmiller
export AS_USER_NAME := ShahmoradM
export AS_PATH := C:/BrAutomation/AS410
export AS_BIN_PATH := C:/BrAutomation/AS410/bin-en
export AS_PROJECT_PATH := C:/projects/ShowCase2Mo410Test
export AS_PROJECT_NAME := ShowCase2Mo410Test
export AS_SYSTEM_PATH := C:/BrAutomation/AS/System
export AS_VC_PATH := C:/BrAutomation/AS410/AS/VC
export AS_TEMP_PATH := C:/projects/ShowCase2Mo410Test/Temp
export AS_CONFIGURATION := Config1
export AS_BINARIES_PATH := C:/projects/ShowCase2Mo410Test/Binaries
export AS_GNU_INST_PATH := C:/BrAutomation/AS410/AS/GnuInst/V4.1.2
export AS_GNU_BIN_PATH := C:/BrAutomation/AS410/AS/GnuInst/V4.1.2/4.9/bin
export AS_GNU_INST_PATH_SUB_MAKE := C:/BrAutomation/AS410/AS/GnuInst/V4.1.2
export AS_GNU_BIN_PATH_SUB_MAKE := C:/BrAutomation/AS410/AS/GnuInst/V4.1.2/4.9/bin
export AS_INSTALL_PATH := C:/BrAutomation/AS410
export WIN32_AS_PATH := "C:\BrAutomation\AS410"
export WIN32_AS_BIN_PATH := "C:\BrAutomation\AS410\bin-en"
export WIN32_AS_PROJECT_PATH := "C:\projects\ShowCase2Mo410Test"
export WIN32_AS_SYSTEM_PATH := "C:\BrAutomation\AS\System"
export WIN32_AS_VC_PATH := "C:\BrAutomation\AS410\AS\VC"
export WIN32_AS_TEMP_PATH := "C:\projects\ShowCase2Mo410Test\Temp"
export WIN32_AS_BINARIES_PATH := "C:\projects\ShowCase2Mo410Test\Binaries"
export WIN32_AS_GNU_INST_PATH := "C:\BrAutomation\AS410\AS\GnuInst\V4.1.2"
export WIN32_AS_GNU_BIN_PATH := "C:\BrAutomation\AS410\AS\GnuInst\V4.1.2\bin"
export WIN32_AS_INSTALL_PATH := "C:\BrAutomation\AS410"

.suffixes:

ProjectMakeFile:

	@'$(AS_BIN_PATH)/4.9/BR.AS.AnalyseProject.exe' '$(AS_PROJECT_PATH)/ShowCase2Mo410Test.apj' -t '$(AS_TEMP_PATH)' -c '$(AS_CONFIGURATION)' -o '$(AS_BINARIES_PATH)'   -sfas -buildMode 'Build'   

