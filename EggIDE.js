
//load the backend 
app.LoadScript( "lexer.js"  );

//for switching states
//between IDE and console 
isDebug = false ;


//Called when application is started.
function OnStart()
{
 
//  alert( app.LoadText( "setting.js", "{}") );
 app.EnableBackKey( false );
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "VCenter,FillXY" );	
  
  //create the command line 
  //but don't show it
      createDlg();

   
	//Create a text label and add it to layout.
   code = app.CreateCodeEdit(1,1);
   code.SetColorScheme( settings.ide_theme )
   code.SetTextSize(settings.ide_font_size);
   code.SetNavigationMethod( settings.ide_navigation );
   code.SetLanguage(settings.ide_syntax);
   lay.AddChild(code);
	   
	//Add layout to app.	
	app.AddLayout( lay );
	
	//create the floating menu button
	//create it above the IDE
		create_menu();
		
		//Create a drawer containing a menu list.
	CreateDrawer();
	
	//Add main layout and drawer to app.	
	app.AddDrawer( drawerScroll, "Left", drawerWidth );
}


// call when the back key is pressed
function OnBack()
{ 
//  app.ShowPopup( "Called"  );
	 if ( isDebug) {
	     isDebug = false ;
	 }
	 
}

// the main compiler entry function
//it is called by the run button 
  function cmpl(){
      //if the command line is not open yet open it
        if( !isDebug )
        {
	            try{
	               //we use a try block to catch 
	               //syntax and reference errors
	               
	               //show the command line
	            dlg.Show();
	            //run the current code on the IDE 
	             run(code.GetText());
	             
	             //now the terminal is shown 
	            isDebug = true ;
	          //print success
	           topScope.print(settings.compiler_success, x ,y );
              
            	 return 
            	 
            	 }catch(e){ // we got an error
            	     //print it
            	   topScope.print(e);
            	   // print fail
            	   topScope.print(settings.compiler_fail , x ,y );
            	 } 
         }
            	 
  }
  
  // called when we exit out of the terminal
  function dlg_exit()
{
   // we exit the dialog
	 dlg.Dismiss();
	   //clear the terminal and reset the cursor y-coordinate
	    txt.Clear();
	     y = 0.02 ;
	     
	 /*
	  * I call OnBack because I want to clear the isDebug
	  * and I had a bug, when exiting the terminal
	  * the bug required me to double click the back key
	  * so I do it with code
	  * we exit the console using the back-key
	  * and we simulate the double click
	 */
	 OnBack();
}

// Console dialog
  function createDlg()
{
    dlg = app.CreateDialog( "running" );
    //set the exit function
    dlg.SetOnBack( dlg_exit );

    //the main console layout
    layDlg = app.CreateLayout( "linear", "VCenter,FillXY" );
    layDlg.SetSize( 1, 1 );
    //create the console and add it to the main layout
    CMD(layDlg);
    dlg.AddLayout( layDlg );


 //   dlg.Show();
}

app.LoadPlugin( "UIExtras" );

//create floating menu
function create_menu()
{ 
  //creates the plugin componet
 uix = app.CreateUIExtras();
 //the button layout,
 // its transparent and touchthrough
 layFam = app.CreateLayout( "Linear", "FillXY, Bottom, Right, TouchThrough" );
 
 //the menu button with the cogs icon
 fam = uix.CreateFAMenu( "[fa-cogs]", "Up,LabelsLeft" );
 fam.SetMargins( 0.02, 0.01, 0.02, 0.01 );
 fam.SetLabelBackColor( settings.float_menu_back_color );
 fam.SetLabelTextColor( settings.float_menu_text_color );
 fam.SetOnOpened( fam_OnOpened );
 fam.SetOnClosed( fam_OnClosed );
 
 //add the menu button to the menu layout
 layFam.AddChild( fam );
 
 // the run button
 fabReply = uix.CreateFAButton( "[fa-code]", "Mini" );
 fabReply.SetButtonColors(settings.float_menu_item_back_color
 , settings.float_menu_item_text_color );
 fabReply.SetOnTouch( cmpl );
 fabReply.SetLabel( "Run" );
 fam.AddFAButton( fabReply );
 
  
  // the new file button
 fabFile = uix.CreateFAButton( "[fa-plus-circle]", "Mini" );
 fabFile.SetButtonColors( settings.float_menu_item_back_color
 , settings.float_menu_item_text_color );
// fabReplyAll.SetOnTouch( fab_OnMailReplyAll );
 fabFile.SetLabel( "New file" );
 fam.AddFAButton( fabFile );
 
  // the save button
 fabSave= uix.CreateFAButton( "[fa-save]", "Mini" );
 fabSave.SetButtonColors( settings.float_menu_item_back_color
 , settings.float_menu_item_text_color );
// fabReplyAll.SetOnTouch( fab_OnMailReplyAll );
 fabSave.SetLabel( "Save");
 fam.AddFAButton( fabSave );
 
  // the Open button
 fabOpen = uix.CreateFAButton( "[fa-folder-open]", "Mini" );
 fabOpen.SetButtonColors( settings.float_menu_item_back_color
 , settings.float_menu_item_text_color );
fabOpen.SetOnTouch( OpenFile );
 fabOpen.SetLabel( "Pull request" );
 fam.AddFAButton( fabOpen);
 

 
 // the github button
 fabGithub = uix.CreateFAButton( "[fa-github]", "Mini" );
 fabGithub.SetButtonColors( settings.float_menu_item_altenate_back_color, 
 settings.float_menu_item_alternate_back_color );
// fabReplyAll.SetOnTouch( fab_OnMailReplyAll );
 fabGithub.SetLabel( "Pull request" );
 fam.AddFAButton( fabGithub );
 

 
 app.AddLayout( layFam ); 
}

// these adjust the menu button color
// when pressed and released
function fam_OnOpened()
{
 layFam.SetBackColor( settings.float_menu_down_color );
}

function fam_OnClosed()
{
 layFam.SetBackColor( settings.float_menu_up_color );
}



function CMD(layq)
{
		
	//Create a scroller for log window.
    scroll = app.CreateScroller( 1,1 )
    scroll.SetBackColor( settings.terminal_back_color );
    layq.AddChild( scroll );
      
	//Create text control for logging (max 500 lines).
	txt = app.CreateImage( null, 1,1);
	txt.SetBackColor( settings.terminal_back_color );
	scroll.AddChild( txt );
	 
	 return ;
}

//Create the drawer contents.
function CreateDrawer()
{
    //Create a layout for the drawer.
	//(Here we also put it inside a scroller to allow for long menus)
	drawerWidth = 0.75;
    drawerScroll = app.CreateScroller( drawerWidth, -1, "FillY" );
    drawerScroll.SetBackColor(settings.drawer_scroll_back_color);
	layDrawer = app.CreateLayout( "Linear", "Left" );
	drawerScroll.AddChild( layDrawer );
	
	//Create layout for top of drawer.
	layDrawerTop = app.CreateLayout( "Absolute" );
	layDrawerTop.SetBackground(settings.drawer_back_image);
	layDrawerTop.SetSize( drawerWidth, 0.23 );
	layDrawer.AddChild( layDrawerTop );
	
	//Add an icon to top layout.
	var img = app.CreateImage( settings.drawer_icon , 0.30);
	img.SetPosition( drawerWidth*0.06, 0.06 );
	layDrawerTop.AddChild( img );
	
	//app title
	var title = app.CreateText(settings.drawer_app_title_text ,  0.4, 0.1);
	title.SetTextSize( 30);
	title.SetTextColor(settings.drawer_app_title_text_color);
	title.SetPosition( drawerWidth*0.4 , 0.075 );

	layDrawerTop.AddChild( title);
	
	
	
	//Add user name to top layout.
	var txtUser = app.CreateText(settings.drawer_user_text ,-1,-1,"Bold");
	txtUser.SetPosition( drawerWidth*0.07, 0.155 );
	txtUser.SetTextColor(settings.drawer_user_text_color);
	txtUser.SetTextSize( 13.7, "dip" );
	layDrawerTop.AddChild( txtUser );
	
	//Add user email to top layout.
	txtGitHubRepo =  app.CreateText(settings.drawer_github_repo_text);
	txtGitHubRepo.SetPosition( drawerWidth*0.07, 0.185 );
	txtGitHubRepo.SetTextColor(settings.drawer_github_repo_text_color);
	txtGitHubRepo.SetTextSize( 14, "dip" );
	layDrawerTop.AddChild( txtGitHubRepo );
	
	//Create menu layout.
	var layMenu = app.CreateLayout( "Linear", "Left" );
	layDrawer.AddChild( layMenu );
	
	   
    //Add title between menus.
	txtTitle = app.CreateText( "Recent files",-1,-1,"Left");
	txtTitle.SetTextColor( "#666666" );
	txtTitle.SetMargins( 16,12,0,0, "dip" );
	txtTitle.SetTextSize( 14, "dip" );
	layMenu.AddChild( txtTitle );
	
    //Add a list to menu layout (with the menu style option).
    lstMenu1 = app.CreateList( ""  , drawerWidth, -1, "Menu,Expand" );
    lstMenu1.SetColumnWidths( -1, 0.35, 0.18 );
    
    for ( var i = 0; i<settings.file_list.length; i++)
    {
            lstMenu1.AddItem( settings.file_list[i] ,  "", "[fa-file]" );
    }
    
  //  lstMenu1.SetItemByIndex( 0, "Primary", 21 );
   lstMenu1.SetOnTouch( FileListClick );
    layMenu.AddChild( lstMenu1 );
    
    //Add seperator to menu layout.
    var sep = app.CreateImage( null, drawerWidth,0.001,"fix", 2,2 );
    sep.SetSize( -1, 1, "px" );
    sep.SetColor(settings.drawer_separator_color );
    layMenu.AddChild( sep );
 
	
    //Add a second list to menu layout.
    var listItems = "Starred::[fa-star],Important::[fa-flag],Settings::[fa-cog]";
    lstMenu2 = app.CreateList( listItems, drawerWidth, -1, "Menu,Expand" );
    lstMenu2.SetColumnWidths( -1, 0.35, 0.18 );
   // lstMenu2.SetOnTouch( lstMenu_OnTouch );
    layMenu.AddChild( lstMenu2 );
}
function FileListClick(title)
{
	  settings.file_select = title ;
	  code.SetText(app.ReadFile(settings.file_select, "UTF-8" ));
	  app.CloseDrawer( "left"  );
}

function OpenFile()
{
	 app.ChooseFile( "Open file" , "text/plain"  , Choose );
}

function Choose(file)
{
    var file_name = file.split("/");
    file_name = file_name[file_name.length-1] ;
    
    if (  file_name.substring(file_name.length-4,file_name.length) == ".egg" )
       {
	 settings.file_list[settings.file_index] = file;
	 settings.file_select = file ;
	 settings.file_index++;
	 code.SetText(app.ReadFile(file, "UTF-8" ));
	 lstMenu1.RemoveAll();
	 
for ( var i = 0; i<settings.file_list.length; i++)
    {
            lstMenu1.AddItem( settings.file_list[i] ,  "", "[fa-file]" );
    }
    
    }else{
        alert("Not an egg source file:["+file+"]");
    }
}





// the settings object

settings = {
   ide_theme: "light" ,
   float_menu_down_color:  "#99FFFFFF",
   float_menu_up_color: "#00FFFFFF",
   float_menu_back_color:  "#FFFFFF" ,
   float_menu_text_color: "#646464" ,
   float_menu_item_back_color: "#db4437",
   float_menu_item_text_color: "#c33d32" ,
   float_menu_item_altenate_back_color : "#fbbc05", 
   float_menu_item_altenate_text_color: "#efb306"  ,
   ide_font_size:10,
   ide_syntax: ".js" ,
   compiler_success: "===== Execution success!! ======", 
   compiler_fail: "===== Execution aborted!! ======",
   terminal_back_color: "#000000",
   file_index: 0,
   file_select: "Unsaved" ,
   file_list: [ 
         "Unsaved"
   ],
   
   /* side drawer */
   drawer_scroll_back_color: "#ffffff",
   drawer_user_text_color: "#aaaaaa",
   drawer_github_repo_text_color: "#bbbbbb",
   drawer_user_text: "[un-assigned]",
   drawer_github_repo_text: "[github-repo]",
   drawer_back_image: "Img/gridbg.png",
   drawer_icon: "Img/eggicon.png",
   drawer_separator_color: "#cccccc",
   drawer_app_title_text: "EggIDE" ,
   drawer_app_title_text_color: "#555555" 
}

  
  
  