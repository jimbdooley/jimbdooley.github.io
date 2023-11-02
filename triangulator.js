const tri_canvas = document.getElementById("tri_canvas");
const tri_ctx = tri_canvas.getContext("2d");
const tri_canvas2 = document.getElementById("tri_canvas2");
const tri_ctx2 = tri_canvas2.getContext("2d");

function get_ad_and_inds(){
	return {"ad":[[[180.89692867742505,575.4377769957424,0],[183.73552508690736,579.878703635978,1],[187.30033843984077,583.0938481910407,2],[191.36092081093935,585.0767564322291,3],[195.6868242749171,585.820974130842,4],[200.0476009064881,585.3200470581781,5],[204.2128027803664,583.5675209855361,6],[207.95198197126606,580.5569416842148,7],[211.03469055390113,576.2818549255128,8],[214.7837452294742,569.4078425472026,9],[214.3094203261615,586.3435904016778,10],[228.9680928388586,586.7541405280746,11],[230.62998849614,527.4162360335016,12],[230.2809218340783,522.4130719082698,13],[228.96283535672794,517.0755686681173,14],[226.67572906408893,511.4037263130444,15],[224.08413110217458,507.7413450735972,16],[220.3386787247388,504.8383591389447,17],[215.7265714838549,502.69700612880865,18],[210.5350089315963,501.3195236629105,19],[205.0511906200363,500.70814936097184,20],[199.56231610124826,500.8651208427142,21],[194.35558492730556,501.7926757278592,22],[189.71819665028153,503.49305163612837,23],[185.9373508222495,505.9684861872433,24],[183.30024699528286,509.2212170009255,25],[190.5194689287489,520.0888150147277,26],[192.50644288403308,517.4331131680202,27],[195.85054619557525,515.3465835921446,28],[200.04218327409964,514.1073388280159,29],[204.57175853033044,513.9934914165493,30],[208.92967637499186,515.2831538986595,31],[212.60634121880807,518.2544388152618,32],[215.0921574725033,523.1854587072711,33],[215.87752954680172,530.3543261156022,34],[215.28315800458836,551.5763334369542,35],[211.92472383762575,544.503259346873,36],[209.08612742814344,540.0623327066373,37],[205.52131407521003,536.8471881515746,38],[201.46073170411148,534.8642799103862,39],[197.13482824013371,534.1200622117733,40],[192.77405160856273,534.6209892844373,41],[188.6088497346844,536.3735153570792,42],[184.86967054378474,539.3840946584006,43],[181.78696196114967,543.6591814171026,44],[179.80568720922545,547.9726489880429,45],[178.4392010221403,552.4777378048183,46],[177.68945568898351,557.1047414794149,47],[177.5584034988443,561.7839536238193,48],[178.047996740812,566.4456678500177,49],[179.16018770397582,571.0201777699966,50],[191.881075758639,565.4854327101099,51],[191.2982959007247,561.7236824964565,52],[191.40476374765345,557.9222531437036,53],[192.19717797083837,554.1990184302313,54],[193.67223724169247,550.6718521344194,55],[195.99172430143963,547.7501116313359,56],[198.8689656989692,546.0386735796812,57],[202.0083674684364,545.5292591847737,58],[205.11433564399655,546.2135896519316,59],[207.89127625980487,548.083386186473,60],[210.04359535001663,551.1303699937164,61],[211.31892424136097,554.7345672898902,62],[211.9017040992753,558.4963175035435,63],[211.79523625234654,562.2977468562964,64],[211.00282202916162,566.0209815697688,65],[209.52776275830752,569.5481478655806,66],[207.20827569856036,572.4698883686641,67],[204.3310343010308,574.1813264203188,68],[201.19163253156358,574.6907408152264,69],[198.08566435600343,574.0064103480685,70],[195.30872374019512,572.136613813527,71],[193.15640464998336,569.0896300062836,72]],[[242.79149711031116,576.6057381466262,0],[246.02109023442986,580.7951619997776,1],[249.86859589985445,583.6950573161216,2],[254.10305514724823,585.319298286244,3],[258.49350901727456,585.6817591007311,4],[262.8089985505967,584.7963139501687,5],[266.8185647878781,582.676837025143,6],[270.29124876978193,579.3372025162399,7],[272.9960915369717,574.7912846140456,8],[276.1378722429377,567.5883227579377,9],[278.77034190979003,611.4101551719509,10],[293.46152103231293,610.5276251342985,11],[288.73587760968087,531.861436983085,12],[274.044698487158,532.7439670207374,13],[275.0643205694942,549.7172710554969,14],[271.0828510898395,542.9422178241558,15],[267.8532579657208,538.7527939710044,16],[264.0057523002962,535.8528986546604,17],[259.7712930529024,534.2286576845379,18],[255.3808391828761,533.8661968700509,19],[251.06534964955392,534.7516420206133,20],[247.05578341227255,536.8711189456391,21],[243.5830994303687,540.2107534545421,22],[240.87825666317897,544.7566713567364,23],[239.27795464905202,549.2438077834827,24],[238.30918781966844,553.868289240572,25],[237.96775947978279,558.5602547613033,26],[238.24947293414968,563.2498433789756,27],[239.15013148752365,567.8671941268875,28],[240.66553844465926,572.3424460383382,29],[252.94111093496045,565.7187943610679,30],[252.02997921519156,562.022818708829,31],[251.80194089567073,558.2267419114985,32],[252.26406693204206,554.4482717767456,33],[253.4234282799496,550.8051161122397,34],[255.4771586347307,547.6908297706289,35],[258.19285430021995,545.7331435555392,36],[261.2753375179878,544.9497894159238,37],[264.4294305296046,545.3584993007358,38],[267.35995557664074,546.9770051589283,39],[269.77173490066656,549.8230389394541,40],[271.3588890650395,553.3012056389321,41],[272.2700207848084,556.9971812911709,42],[272.49805910432923,560.7932580885015,43],[272.0359330679579,564.5717282232544,44],[270.8765717200503,568.2148838877603,45],[268.82284136526926,571.3291702293711,46],[266.10714569978,573.2868564444608,47],[263.02466248201216,574.0702105840762,48],[259.87056947039537,573.6615006992641,49],[256.9400444233592,572.0429948410717,50],[254.52826509933337,569.1969610605458,51]],[[304.51619833226886,572.2569804570028,0],[307.9025655341638,575.7683171242212,1],[312.0949137038253,578.1605029703944,2],[316.8220527039085,579.4731384886835,3],[321.81279239706845,579.7458241722499,4],[326.7959426459602,579.0181605142546,5],[331.50031331323885,577.329748007859,6],[335.6547142615594,574.7201871462245,7],[338.9879553535769,571.229078422512,8],[341.2288464519464,566.8960223298827,9],[342.4463191890802,562.2744352698866,10],[343.0208190504267,557.5693477184477,11],[342.96249107733973,552.8502344456631,12],[342.2814803111729,548.186570221629,13],[340.9879317932801,543.6478298164424,14],[339.0919905650149,539.3034880001995,15],[336.60380166773115,535.2230195429972,16],[333.2174344658362,531.7116828757788,17],[329.0250862961747,529.3194970296056,18],[324.2979472960915,528.0068615113165,19],[319.30720760293156,527.7341758277502,20],[314.3240573540398,528.4618394857454,21],[309.61968668676116,530.150251992141,22],[305.4652857384406,532.7598128537755,23],[302.1320446464231,536.250921577488,24],[299.8911535480536,540.5839776701173,25],[298.6736808109198,545.2055647301135,26],[298.0991809495733,549.9106522815523,27],[298.15750892266027,554.6297655543369,28],[298.83851968882703,559.293429778371,29],[300.1320682067199,563.8321701835577,30],[302.0280094349851,568.1765119998005,31],[311.91147027620895,560.7081919352825,32],[310.68984826995046,557.102912929916,33],[310.1403551191557,553.3399011303555,34],[310.2800293711361,549.535839073022,35],[311.12590957320316,545.8074092943357,36],[312.907829598933,542.5300095918892,37],[315.4475176958018,540.3488349920618,38],[318.4523671945452,539.3066133334046,39],[321.62977142589904,539.4460724544687,40],[324.68712372059883,540.8099401938052,41],[327.3318174093804,543.4409443899655,42],[329.20852972379106,546.7718080647176,43],[330.43015173004954,550.377087070084,44],[330.9796448808443,554.1400988696445,45],[330.8399706288639,557.944160926978,46],[329.99409042679684,561.6725907056643,47],[328.212170401067,564.9499904081108,48],[325.6724823041982,567.1311650079382,49],[322.6676328054548,568.1733866665954,50],[319.49022857410097,568.0339275455314,51],[316.43287627940117,566.6700598061948,52],[313.7881825906196,564.0390556100346,53]],[[69.08088563048804,106.9327049898445,0],[72.95635717171707,110.75074720587199,1],[77.3404723304698,112.97219729053297,2],[81.92486084977605,113.65253230262661,3],[86.40115247266573,112.84722930095204,4],[90.46097694216867,110.61176534430842,5],[93.79596400131473,107.00161749149493,6],[96.09774339313378,102.07226280131067,7],[98.15882888679891,95.24773496094498,8],[100.8901273721889,110.42970808700952,9],[114.0308268006313,108.06564301141987,10],[105.6924682016355,61.716722583058726,11],[92.55176877319309,64.08078765864838,12],[95.28306725858307,79.26276078471291,13],[90.9726771298909,73.5844872271431,14],[87.09720558866186,69.76644501111561,15],[82.71309042990914,67.54499492645462,16],[78.12870191060287,66.864659914361,17],[73.6524102877132,67.66996291603557,18],[69.59258581821027,69.90542687267919,19],[66.2575987590642,73.51557472549268,20],[63.95581936724515,78.44492941567692,21],[62.890002412926876,83.36757322834296,22],[62.61598549000213,88.35264933091814,23],[63.115916974383396,93.30092914087919,24],[64.37194524198314,98.1131840757028,25],[66.36621866871386,102.69018555286567,26],[77.01957226837149,96.03051663772555,27],[75.79965465663525,92.78658225171311,28],[75.18660390007229,89.37892828754975,29],[75.1994293244675,85.91321843404683,30],[75.8571402556058,82.49511638001573,31],[77.77992806901037,78.96759570739653,32],[80.66674919405129,76.85744321233989,33],[84.05972764587975,76.24703263991371,34],[87.5009874396469,77.21873773518588,35],[90.53265259050394,79.85493224322431,36],[92.34042773162852,82.82948336227446,37],[93.56034534336476,86.0734177482869,38],[94.17339609992773,89.48107171245026,39],[94.16057067553251,92.94678156595319,40],[93.50285974439421,96.36488361998428,41],[91.58007193098965,99.89240429260349,42],[88.69325080594872,102.00255678766013,43],[85.30027235412027,102.6129673600863,44],[81.85901256035311,101.64126226481413,45],[78.82734740949607,99.0050677567757,46]],[[170.28062918292915,93.42338618779604,0],[173.58528677506996,97.74471789203423,1],[177.6163796129604,100.55610870491557,2],[182.06082397170712,101.86946153780565,3],[186.60553612641675,101.69667930207001,4],[190.93743235219603,100.04966490907424,5],[194.74342892415154,96.94032127018387,6],[197.71044211739002,92.3805512967645,7],[200.70357381918149,85.91062974519538,8],[201.2895890926695,101.32466073586602,9],[214.63114532829198,100.81743743192261,10],[212.5779192983943,46.81118352096191,11],[211.96038432763652,42.28693948252947,12],[210.44245216835532,37.51714548119895,13],[208.0241228205507,32.501801516970346,14],[205.09713524038347,29.025015886851023,15],[200.9681306891947,26.483389252967264,16],[195.9951960864725,24.856054163607297,17],[190.53641835170484,24.12214316705935,18],[184.94988440437973,24.260788811611647,19],[179.59368116398522,25.25112364555242,20],[174.82589555000936,27.072280217169876,21],[171.0046144819401,29.70339107475226,22],[168.48792487926556,33.123588766587794,23],[175.6988973324403,42.562946025871774,24],[177.69346530308826,39.6982694734497,25],[181.25973242518174,37.45537050011983,26],[185.73157522154608,36.25706694867557,27],[190.44287021500668,36.526176661910355,28],[194.72749392838892,38.6855174826176,29],[197.91932288451815,43.157907253590736,30],[199.35223360621978,50.36616381762318,31],[200.08656317532117,69.6813237589727,32],[196.61083066006896,63.457337435871864,33],[193.30617306792814,59.136005731633674,34],[189.27508023003773,56.32461491875232,35],[184.830635871291,55.01126208586224,36],[180.28592371658135,55.184044321597874,37],[175.9540274908021,56.83105871459366,38],[172.14803091884656,59.940402353484025,39],[169.18101772560811,64.50017232690341,40],[167.43876821183258,69.22576136889187,41],[166.47183282097026,74.1236561189346,42],[166.27638138783496,79.093111276439,43],[166.84858374724047,84.03338154081246,44],[168.1846097340006,88.84372161146234,45],[179.6634652724212,83.72697721276498,46],[178.9081520471442,80.3445503899202,47],[178.77661402929442,76.88468991304244,48],[179.2729299170998,73.45467827753882,49],[180.4011784087882,70.16179797881655,50],[182.79739488057336,66.9371023821007,51],[185.95042858832795,65.25043163825661,52],[189.39538871862138,65.11946010627182,53],[192.66738445802307,66.5618621451339,54],[195.3015249931024,69.59531211383043,55],[196.67653472757877,72.79302278723503,56],[197.43184795285578,76.17544961007981,57],[197.56338597070555,79.63531008695759,58],[197.0670700829002,83.06532172246119,59],[195.93882159121176,86.35820202118346,60],[193.5426051194266,89.5828976178993,61],[190.38957141167202,91.2695683617434,62],[186.9446112813786,91.4005398937282,63],[183.6726155419769,89.95813785486611,64],[181.03847500689758,86.92468788616958,65]],[[224.15947197133238,91.69997068199166,0],[227.1901343910811,96.21791394500052,1],[231.03942110673879,99.2737768320599,2],[235.394101557186,100.86004036600389,3],[239.94094518130325,100.96918556966655,4],[244.36672141797112,99.59369346588198,5],[248.35819970607008,96.72604507748424,6],[251.60214948448072,92.35872142730742,7],[254.9905261442528,86.08646846145575,8],[254.62034482264897,101.50772863064994,9],[267.96815824640527,101.8281376737188,10],[269.0982817472581,54.74869980671766,11],[255.75046832350182,54.4282907636488,12],[255.38028700189798,69.84955093284297,13],[252.29676554815256,63.421942582887674,14],[249.26610312840387,58.90399931987882,15],[245.4168164127462,55.84813643281944,16],[241.06213596229895,54.26187289887545,17],[236.5152923381817,54.15272769521278,18],[232.08951610151385,55.528219798997355,19],[228.0980378134149,58.395868187395095,20],[224.85408803500422,62.76319183757191,21],[222.82231661215573,67.37191104921712,22],[221.55372003985235,72.20065123266615,23],[221.0507178038562,77.14861983779358,24],[221.3157293899294,82.11502431447394,25],[222.3511742838341,86.99907211258179,26],[234.12107412222895,82.5994057208978,27],[233.5767882783324,79.17667841649391,28],[233.6598769412847,75.71531552831107,29],[234.36776371843618,72.32264613815347,30],[235.69787221713716,69.10599932782539,31],[238.28928769838285,66.03596986954764,32],[241.5407698185474,64.547902739803,33],[244.987225889813,64.63063357044285,34],[248.16356322436178,66.27299799331855,35],[250.6046891343759,69.46383164028147,36],[251.77892587777103,72.7405942791022,37],[252.32321172166758,76.16332158350609,38],[252.24012305871528,79.62468447168894,39],[251.5322362815638,83.01735386184653,40],[250.20212778286282,86.23400067217462,41],[247.61071230161713,89.30403013045236,42],[244.35923018145257,90.792097260197,43],[240.91277411018697,90.70936642955715,44],[237.7364367756382,89.06700200668145,45],[235.2953108656241,85.87616835971853,46]],[[385.7019188645118,107.64259029287106,0],[387.4589513398854,112.79133411158321,1],[390.3853691999482,116.73992686244412,2],[394.1805787373102,119.39997543195258,3],[398.54398624458156,120.6830867066074,4],[403.17499801437236,120.50086757290734,5],[407.77302033929277,118.76492491735121,6],[412.0374595119529,115.3868656264378,7],[416.93479794464724,110.20629327082132,8],[412.5829454447013,125.00540402909168,9],[425.39225979849834,128.77213350383482,10],[438.6779943707506,83.59205043755814,11],[425.8686800169536,79.825320962815,12],[421.5168275170076,94.62443172108534,13],[420.2033676136805,87.6175010993027,14],[418.44633513830684,82.46875728059055,15],[415.51991727824407,78.52016452972964,16],[411.7247077408821,75.86011596022118,17],[407.3613002336107,74.57700468556637,18],[402.7302884638199,74.75922381926642,19],[398.13226613889947,76.49516647482255,20],[393.86782696623936,79.87322576573595,21],[390.71167466644494,83.79841245518065,22],[388.2356647725974,88.13378372279826,23],[386.46824076508847,92.78261335448245,24],[385.43784612431006,97.64817513612687,25],[385.17292433065387,102.6337428536252,26],[397.6855918067002,101.44437929500515,27],[398.0464105632055,97.99747936824022,28],[399.0232010831041,94.67576037804298,29],[400.58567528825955,91.58222136286926,30],[402.7035451005355,88.8198613611749,31],[405.4241371215388,86.7866252280917,32],[408.35457692373205,85.94840058236808,33],[411.23657216530876,86.22923352435649,34],[413.8118305044625,87.55317015440934,35],[415.8220595993869,89.84425657287906,36],[417.00896710827544,93.02653888011804,37],[417.29440819329983,96.49562070499485,38],[416.93358943679453,99.94252063175978,39],[415.95679891689593,103.26423962195702,40],[414.39432471174047,106.35777863713074,41],[412.2764548994645,109.1201386388251,42],[409.5558628784612,111.1533747719083,43],[406.62542307626796,111.99159941763192,44],[403.74342783469126,111.71076647564351,45],[401.16816949553754,110.38682984559065,46],[399.15794040061314,108.09574342712094,47],[397.9710328917246,104.91346111988196,48]],[[355.81125266543256,480.95500077267866,0],[358.6133194688638,483.0435006340616,1],[361.85503068819065,484.24716326319714,2],[365.3492838515645,484.6255103896987,3],[368.90897648713644,484.23806374317974,4],[372.3470061230578,483.1443450532537,5],[375.4762702874797,481.40387604953406,6],[378.1096665085534,479.07617846163424,7],[380.06009231443016,476.2207740191678,8],[381.1404452332612,472.89718445174805,9],[381.4721381837949,468.92074855121507,10],[381.1754219008625,464.97658732537553,11],[380.27451052946867,461.1408162771479,12],[378.7936182146184,457.4895509094507,13],[376.75695910131634,454.09890672520237,14],[374.18874733456744,451.04499922732134,15],[371.3866805311362,448.9564993659384,16],[368.14496931180935,447.75283673680286,17],[364.6507161484355,447.3744896103013,18],[361.09102351286356,447.76193625682026,19],[357.6529938769422,448.8556549467463,20],[354.5237297125203,450.59612395046594,21],[351.8903334914466,452.92382153836576,22],[349.93990768556984,455.7792259808322,23],[348.8595547667388,459.10281554825195,24],[348.5278618162051,463.07925144878493,25],[348.8245780991375,467.02341267462447,26],[349.72548947053133,470.8591837228521,27],[351.2063817853816,474.5104490905493,28],[353.24304089868366,477.90109327479763,29],[359.33417669520094,471.3519674239084,30],[357.9418778673543,468.24535588978034,31],[357.2833442117135,464.9053162681008,32],[357.4085960327537,461.48908395291414,33],[358.9878599114574,457.9565920261669,34],[361.8320473832307,456.04175837720777,35],[365.25980507388266,455.9613376587631,36],[368.5897796092221,457.9320845235592,37],[370.66582330479906,460.6480325760916,38],[372.0581221326457,463.75464411021966,39],[372.7166557882865,467.0946837318992,40],[372.5914039672463,470.51091604708586,41],[371.0121400885426,474.0434079738331,42],[368.1679526167693,475.95824162279223,43],[364.74019492611734,476.0386623412369,44],[361.4102203907779,474.0679154764408,45]],[[9.290828705129194,584.939191940301,229],[33.33424766166626,503.1760301259459,230],[49.99904760776519,508.0765104650096,231],[41.51206495316169,536.9377359570399,232],[70.96566912761439,514.2419920109589,233],[89.5291712948708,519.700808059699,234],[47.803954888118675,551.8477235538453,235],[65.48575233833374,601.4639698740542,236],[46.92225017107732,596.0051538253142,237],[34.44261130583162,560.9784467873345,238],[25.955628651228118,589.8396722793648,239]],[[88.22522582723286,572.7915610993016,244],[98.24779984816414,522.0468703918497,245],[112.63477417276715,524.8884389006985,246],[102.61220015183588,575.6331296081504,247]],[[98.41811491046143,594.8304563464699,268],[94.84855399867811,595.3835518683937,269],[91.3140517143169,595.1053220938963,270],[87.93873651516517,594.0202573437792,271],[84.84673685901029,592.1528479388437,272],[82.52834652431672,589.1968268511752,273],[82.20045724064533,585.9564861721433,274],[83.73449482378851,583.0835003051332,275],[87.00188508953856,581.2295436535301,276],[90.57144600132187,580.6764481316062,277],[94.10594828568308,580.9546779061036,278],[97.48126348483481,582.0397426562207,279],[100.5732631409897,583.9071520611562,280],[102.89165347568327,586.8631731488248,281],[103.21954275935465,590.1035138278567,282],[101.68550517621148,592.9764996948668,283]],[[130.78080913572984,563.0367023314933,312],[128.71892772575723,579.8534364628242,313],[114.16326709107577,578.068782805453,314],[120.45796782661255,526.7291139991751,315],[135.013628461294,528.5137676565464,316],[132.27396596499818,550.8584939763772,317],[132.25666453076224,557.6053111276756,318],[133.7836804495637,562.8542407281046,319],[136.47201053106596,566.5583231746909,320],[139.93865158493247,568.6705988644613,321],[143.80060042082658,569.1441081944423,322],[147.6748538484117,567.9318915616607,323],[151.1784086773512,564.986989363143,324],[153.92826171730852,560.2624419959161,325],[155.541409777947,553.7112898570066,326],[158.2810722742428,531.3665635371758,327],[172.83673290892423,533.151217194547,328],[170.09707041262843,555.4959435143778,329],[169.17295759511285,560.7727700367269,330],[167.74649872826495,565.626236543753,331],[165.8176938120848,570.0563430354559,332],[163.38654284657233,574.0630895118361,333],[159.91612043684566,578.0300194780708,334],[155.91080557990193,580.6763855315044,335],[151.59942675877895,582.0302440825885,336],[147.21081245651453,582.1196515417752,337],[142.9737911561465,580.9726643195161,338],[139.11719134071268,578.6173388262631,339],[135.8698414932509,575.081731472468,340],[133.46057009679896,570.3938986685828,341]],[[367.99214639612364,553.7390861784849,741],[372.77199448417844,569.9936585160601,742],[358.70291086426033,574.1308379536201,743],[344.11055209420283,524.507388246816,744],[358.17963571412093,520.370208809256,745],[364.53071414253975,541.9679796661034,746],[367.19181578143036,548.1679022460769,747],[370.67615405330827,552.3801297156358,748],[374.61352907190354,554.7135237034857,749],[378.63374095094645,555.2769458383327,750],[382.36658980416706,554.1792577488825,751],[385.44187574529565,551.5293210638407,752],[387.4893988880624,547.4359974119135,753],[388.13895934619745,542.0081484218064,754],[387.020357233431,535.3546357222253,755],[380.6692788050122,513.756864865378,756],[394.7383624249303,509.61968542781796,757],[401.0894408533491,531.2174562846653,758],[403.7240901959718,537.4251574733352,759],[407.1422977271798,541.656831464635,760],[410.99370278290434,544.0155059307482,761],[414.9279446990764,544.6042085438584,762],[418.5946628116272,543.5259669761491,763],[421.64349645648787,540.8838088998037,764],[423.7240849695895,536.780761987006,765],[424.4860676868633,531.3198539099393,766],[423.5790839442404,524.6041123407872,767],[417.22800551582156,503.0063414839399,768],[431.29708913573967,498.86916204637987,769],[437.6481675641585,520.4669329032272,770],[438.89362757233357,525.6773195206466,771],[439.50999306385035,530.6984137417785,772],[439.4972640387088,535.530215566623,773],[438.8554404969089,540.1727249951801,774],[437.05396071516424,545.2468836060151,775],[433.92679724171126,549.4124715764333,776],[429.79870380704165,552.57399125411,777],[424.99443414164716,554.6359449867205,778],[419.83874197601943,555.5028351219402,779],[414.6563810406502,555.0791640074444,780],[409.77210506603126,553.2694339909087,781],[405.5106677826542,549.9781474200082,782],[402.97631047070337,547.297005539194,783],[402.29671378609953,550.9232483766182,784],[400.6851209348154,555.9415685032004,785],[398.0585684598492,559.9599459242247,786],[394.6382354023506,562.9133403424134,787],[390.6453008034691,564.7367114604891,788],[386.3009437043545,565.3650189811741,789],[381.82634314615626,564.7332226071906,790],[377.44267817002407,562.776282041261,791],[373.3711278171075,559.4291569861077,792]],[[26.26491704984654,137.46760709830875,850],[22.96210260568447,133.47880472887735,851],[20.119342460309205,129.44495069678857,852],[17.730531076222707,125.3452822290226,853],[15.789562915926936,121.15903655255958,854],[14.290332441923859,116.86545089437966,855],[13.22673411671543,112.44376248146298,856],[12.592662402803615,107.87320854078969,857],[12.382011762690365,103.13302629933992,858],[12.588676658877649,98.20245298409384,859],[13.206551553867424,93.0607258220316,860],[14.78386254985945,87.50508371889114,861],[17.20919062994499,82.71479874560269,862],[20.354935029304105,78.72387418514813,863],[24.09349498311685,75.56631332050931,864],[28.297269726563282,73.27611943466812,865],[32.838658494823456,71.88729581060639,866],[37.590060523077426,71.43384573130604,867],[42.42387504650526,71.94977247974887,868],[47.21250130028701,73.46907933891681,869],[51.828338519602724,76.0257695917917,870],[56.143785939632465,79.6538465213554,871],[53.66678830937867,93.45961035865682,872],[50.75166620882628,89.33467544190003,873],[47.09660380841146,86.5611800694333,874],[42.96199241202358,85.08830392994219,875],[38.60822332355198,84.8652267121122,876],[34.29568784688605,85.8411281046289,877],[30.284777285915126,87.96518779617782,878],[26.835882944528578,91.18658547544447,879],[24.209396126615758,95.45450083111443,880],[22.665708136066037,100.71811355187322,881],[22.46521027676877,106.92660332640638,882],[23.09711753696177,111.76406932440723,883],[24.456706924725385,116.38755183801094,884],[26.543978440059625,120.79705086721748,885],[30.0733082719235,125.90874096052138,886],[34.22054336220971,129.4988708456648,887],[38.73923170234982,131.6656634459187,888],[43.38292128377541,132.507341684554,889],[47.905160097918056,132.12212848484168,890],[52.05949613620935,130.60824677005263,891],[55.59947739008084,128.06391946345786,892],[58.27865185096414,124.58736948832826,893],[59.8505675102908,120.27681976793482,894],[60.0687723594924,115.23049322554844,895],[69.62474545665357,125.49782055830423,896],[67.96016246593567,130.88439573265077,897],[65.46304828298418,135.53273296672364,898],[62.259098665762366,139.40235072317282,899],[58.47400937223347,142.45276746464825,900],[54.23347616036076,144.6435016537999,901],[49.66319478810748,145.93407175327775,902],[44.888861013436895,146.28399622573176,903],[40.03617059431225,145.65279353381192,904],[35.23081928869681,143.99998214016816,905],[30.59850285455382,141.28508050745046,906]],[[133.077016959885,90.52140407304992,1018],[134.6170175504568,105.87004237088851,1019],[121.3320617128318,107.20298405852631,1020],[116.63060662268273,60.34525290308824,1021],[129.91556246030774,59.01231121545044,1022],[131.96179161871459,79.40634964579655,1023],[133.7938365002194,86.51671504591481,1024],[137.15217043972066,90.79338754085538,1025],[141.4428516614431,92.69517429721427,1026],[146.07193838961132,92.68088248158743,1027],[150.44548884845008,91.20931926057088,1028],[153.96956126218407,88.73929180076057,1029],[156.05021385503798,85.72960726875249,1030],[163.85295707806455,94.71761680801808,1031],[161.31934217349112,99.10464735714848,1032],[157.81727710696575,102.19461351479671,1033],[153.6653803303516,103.93979540278556,1034],[149.18227029551184,104.29247314293781,1035],[144.68656545430954,103.20492685707626,1036],[140.49688425860788,100.62943666702373,1037],[136.93184516026997,96.51828269460296,1038]],[[290.404906113403,87.54953393208825,1303],[288.66554328086806,102.87655353092785,1304],[275.39929942641027,101.3710546086497,1305],[280.7093858592999,54.5793230009219,1306],[293.9756297137577,56.084821923200046,1307],[291.66450401239643,76.4501351617966,1308],[291.81412935464937,83.26449956576926,1309],[293.6724170729818,88.33065901511688,1310],[296.7423447085938,91.59220969393799,1311],[300.52688980268556,92.9927477863311,1312],[304.52902989645736,92.47586947639469,1313],[308.25174253110936,89.9851709482273,1314],[311.1980052478417,85.46424838592743,1315],[312.8707955878547,78.85669797359358,1316],[315.18192128921595,58.491384734997034,1317],[328.44816514367375,59.99688365727518,1318],[326.13703944231247,80.36219689587173,1319],[326.2555897826755,87.17303480188698,1320],[328.03840963927513,92.23062989905235,1321],[331.0151122692173,95.48160108400126,1322],[334.7153109296078,96.87256725336714,1323],[338.66861887755255,96.3501473037834,1324],[342.40464937015736,93.86096013188347,1325],[345.4530156645281,89.35162463430076,1326],[347.3433310177707,82.7687597076687,1327],[349.65445671913204,62.40344646907216,1328],[362.9207005735898,63.9089453913503,1329],[360.6095748722285,84.27425862994686,1330],[359.811491076179,89.08590692923141,1331],[358.55259738470005,93.51624017099624,1332],[356.8328937977916,97.56525835524137,1333],[354.6523803154537,101.23296148196677,1334],[351.34632615180374,104.85261160901577,1335],[347.24948703821104,107.24114002648638,1336],[342.66808492187107,108.43329785282165,1337],[337.9083417499793,108.46383620646466,1338],[333.27647946973127,107.36750620585846,1339],[329.07872002832255,105.17905896944612,1340],[325.6212853729486,101.93324561567066,1341],[323.210397450805,97.66481726297518,1342],[322.032590229847,94.51912880076483,1343],[320.17984488553765,97.32089974789164,1344],[316.5606268081058,101.38252738074594,1345],[312.33014587459064,103.88400382755486,1346],[307.799718468774,104.86065834092472,1347],[303.2806609744379,104.34782017346183,1348],[299.0842897753642,102.38081857777252,1349],[295.52192125533475,98.9949828064631,1350],[292.9048717981315,94.2256421121399,1351]],[[361.8410319287628,112.6720649911028,1356],[371.1508077782697,66.50845678472514,1357],[384.2389680712372,69.14793500889719,1358],[374.9291922217303,115.31154321527485,1359]],[[371.02204114825133,132.77208799961704,1378],[367.77021196088856,133.26264027003782,1379],[364.553328450746,132.99646146861244,1380],[361.4843109944658,131.99630021901194,1381],[358.67607996868986,130.2849051449074,1382],[356.576126077866,127.5852288148622,1383],[356.2894081109501,124.63394986251159,1384],[357.6964957936688,122.02390026522777,1385],[360.6779588517487,120.34791200038295,1386],[363.9297880391115,119.85735972996217,1387],[367.14667154925405,120.12353853138757,1388],[370.2156890055343,121.12369978098806,1389],[373.0239200313102,122.83509485509259,1390],[375.12387392213407,125.5347711851378,1391],[375.41059188904995,128.4860501374884,1392],[374.00350420633123,131.09609973477222,1393]],[[414.95188963348187,471.1130260275097,1617],[418.1237940730325,475.9420124138524,1618],[421.711842653225,478.2728553492061,1619],[425.3903980652054,478.59820433255345,1620],[428.83382300011965,477.410708862877,1621],[431.7164801491139,475.20301843915956,1622],[433.7127322033342,472.46778256038374,1623],[434.4969418539265,469.6976507255321,1624],[442.57638807458676,474.40097644130935,1625],[441.9092685842942,477.3257968127749,1626],[440.2611195630692,480.11246010345207,1627],[437.8172879662638,482.67161428042255,1628],[434.7631207492299,484.91390731076797,1629],[431.2839648673196,486.74998716156995,1630],[427.56516727588473,488.09050179991016,1631],[423.7920749302774,488.84609919287027,1632],[420.1500347858495,488.92742730753196,1633],[416.8243937979531,488.24513411097684,1634],[414.0004989219401,486.7098675702865,1635],[410.7371223550368,483.7864684452694,1636],[408.20241777361963,480.77168462259385,1637],[406.39638517768867,477.66551610225974,1638],[402.42319246169023,468.97925671903755,1639],[392.2201114022521,473.646260725895,1640],[388.673687501854,465.89301035933795,1641],[398.8767685612922,461.2260063524805,1642],[388.70669298485143,438.99201955183315,1643],[398.26048706777993,434.6220067090485,1644],[408.43056264422063,456.8559935096958,1645],[418.6336437036588,452.18898950283835,1646],[422.1800676040569,459.9422398693954,1647],[411.9769865446187,464.60924387625283,1648]]],"inds":[[0,50,72,72,51,50],[0,29,51,51,30,29],[0,31,53,53,32,31],[0,26,46,46,27,26],[0,45,65,65,46,45],[0,26,46,46,27,26],[0,26,48,48,27,26],[0,29,45,45,30,29],[],[],[],[],[],[],[],[],[],[],[]]}


}


function draw_all_dots(dots_arr, _ctx=tri_ctx, _clear=true){
	function draw_dots(arr, _ctx=tri_ctx, clear=true){
		if (clear) _ctx.clearRect(0, 0, tri_canvas2.width, tri_canvas2.height);
		for(let i = 0; i < arr.length; i++){
			_ctx.beginPath();
			_ctx.arc(arr[i][0], arr[i][1], 1, 0, 2*Math.PI);
			_ctx.fill();
		}
	}

	if (_clear) _ctx.clearRect(0, 0, tri_canvas2.width, tri_canvas2.height);

	for(let i = 0; i < dots_arr.length; i++){
		draw_dots(dots_arr[i], _ctx, i==0-1);
	}
}

function draw_triangles(dots, ind){
	for(let i = 0; i < ind.length; i+= 3){
		tri_ctx2.beginPath();
		tri_ctx2.moveTo(dots[ind[i+2]][0], dots[ind[i+2]][1]);
		tri_ctx2.lineTo(dots[ind[i+0]][0], dots[ind[i+0]][1]);
		tri_ctx2.lineTo(dots[ind[i+1]][0], dots[ind[i+1]][1]);
		tri_ctx2.lineTo(dots[ind[i+2]][0], dots[ind[i+2]][1]);
		tri_ctx2.stroke();
	}
}

function draw_all_triangles(triangles){
	for(let i = 0; i < triangles.ad.length; i++){
		draw_triangles(triangles.ad[i], triangles.ind[i])
	}
}

function clip_ear(arr, ind){
	function no_points_inside(i0,i1,i2, arr){
		const v0 = [arr[i1][0]-arr[i0][0], arr[i1][1]-arr[i0][1]]
		const v1 = [arr[i2][0]-arr[i1][0], arr[i2][1]-arr[i1][1]]
		const v2 = [arr[i0][0]-arr[i2][0], arr[i0][1]-arr[i2][1]]
		let v3, v4, v5, cp0, cp1, cp2;
		for(let i = 0; i<arr.length; i++){
			if((arr[i0][2]==arr[i][2])||(arr[i1][2]==arr[i][2])||(arr[i2][2]==arr[i][2])) continue
			if((i==i0)||(i==i1)||(i==i2)) continue;
			v3 = [arr[i][0]-arr[i0][0],  arr[i][1]-arr[i0][1]];
			v4 = [arr[i][0]-arr[i1][0],  arr[i][1]-arr[i1][1]];
			v5 = [arr[i][0]-arr[i2][0],  arr[i][1]-arr[i2][1]];
			cp0 = v3[0]*v0[1] - v3[1]*v0[0];
			cp1 = v4[0]*v1[1] - v4[1]*v1[0];
			cp2 = v5[0]*v2[1] - v5[1]*v2[0];
			if( (cp0 < 0) && (cp1 < 0) && (cp2 < 0) ) return false;
			if( (cp0 > 0) && (cp1 > 0) && (cp2 > 0) ) return false;
		}
		return true;
	}
	function triangle_perim(arr, i0, i1, i2){
		const d0 = Math.sqrt((arr[i1][0]-arr[i0][0])*(arr[i1][0]-arr[i0][0]) + (arr[i1][1]-arr[i0][1])*(arr[i1][1]-arr[i0][1]))
		const d1 = Math.sqrt((arr[i2][0]-arr[i1][0])*(arr[i2][0]-arr[i1][0]) + (arr[i2][1]-arr[i1][1])*(arr[i2][1]-arr[i1][1]))
		const d2 = Math.sqrt((arr[i0][0]-arr[i2][0])*(arr[i0][0]-arr[i2][0]) + (arr[i0][1]-arr[i2][1])*(arr[i0][1]-arr[i2][1]))
		return d0 + d1 + d2;
	}

	if(arr.length < 3) return;
	let to_clip = -1;
	let max_angle, max_dist;
	let best_to_clip = -1;
	let best_is = [-1,-1,-1];
	for(let i = 0; i < arr.length; i++){
		min_dist = 10000000
		i1 = (i+1)%arr.length;
		i2 = (i+2)%arr.length;
		th_1 = Math.atan2(arr[i1][1] - arr[i][1], arr[i1][0] - arr[i][0]);
		th_2 = Math.atan2(arr[i2][1] - arr[i1][1], arr[i2][0] - arr[i1][0]);
		d_theta = th_2-th_1;
		dist = triangle_perim(arr, i, i1, i2);
		if(d_theta > Math.PI) d_theta -= 2*Math.PI;
		if(d_theta < -Math.PI) d_theta += 2*Math.PI;
		if((d_theta > 0) && no_points_inside(i,i1,i2,arr)){
			if(dist < min_dist){
				min_dist = dist;
				to_clip = i1;
				best_is[0] = arr[i][2];
				best_is[1] = arr[i1][2];
				best_is[2] = arr[i2][2];
			}
		}
	}
	ind.push(best_is[0]);
	ind.push(best_is[1]);
	ind.push(best_is[2]);
	if(to_clip == -1) console.log("AAAAAAAHHHhhhhh we got -1");
	for(let i = to_clip; i < arr.length-1; i++){
		arr[i] = arr[i+1];
	}
	arr.pop();
}

function triangulate(_arr, rev = false){
	const rtn = [];
	const arr = [];
	for(let i = 0; i < _arr.length; i++){
		arr.push([_arr[i][0], _arr[i][1], rev ? _arr.length-i-1 : i]);
	}
	while(arr.length > 2){
		clip_ear(arr, rtn);
	}
	return rtn;
}


function reverse(old_arr){
	const rtn = [];
	for(let i = old_arr.length - 1; i >= 0; i--){
		rtn.push(old_arr[i]);
	}
	return rtn;
}

function reverse_pre_cut(obj){
	obj.ad = reverse(obj.ad);
	for(let i = 0; i < obj.ind.length; i++){
		obj.ind[i] = obj.ad.length - obj.ind[i] - 1;
	}
}


res = get_ad_and_inds();
ad = res.ad;
for (const el of ad) {
	for (const p of el) {
		p[1] = tri_canvas2.height - p[1]
	}
}
ind = res.inds;
draw_all_dots(ad)


let next_tri = 0
const revs = {}
for(let i = 0; i < 19; i++) revs["" + i] = i >= 8
function do_next(){
	if (next_tri >= 19) return
	const rev = next_tri != 8
	tri_ctx2.clearRect(0, 0, tri_canvas2.width, tri_canvas2.height)
	do_all(revs, next_tri)
	draw_all_triangles(triangles)
	next_tri += 1
}

triangles = {ad:[],ind:[]};
function do_all(revs={}, just_one = -1){
	for(let i = 0; i < ad.length; i++){
		for(let j = 0; j < ad[i].length; j++){
			ad[i][j][2] = j
		}
	}
	for(let h = 0; h < ad.length; h++){
		if(just_one != -1) h = just_one;
		dict = {}
		let max = -1;
		for(let i = 0; i < ad[h].length; i++){
			if(ad[h][i][2] in dict) continue;
			dict[ad[h][i][2]] = ad[h][i]
			max = Math.max(max, ad[h][i][2]);
		}
		ad_orig = [];
		ad_arr = [];
		count = 0;



		for(let i = 0; i<= max; i++){
			ad_orig.push([dict[i][0], dict[i][1],dict[i][2]]);
			ad_arr.push([dict[i][0], dict[i][1],dict[i][2]]);
			count++;
		}
		if(( (""+h in revs) && revs[""+h] )){
			ad_orig = reverse(ad_orig);
			ad_arr = reverse(ad_arr);
			for(let i = 0; i < ind[h].length; i++){
				ind[h][i] = ad[h].length - 1 - ind[h][i]
			}
		}




		ad_ind = triangulate(ad_arr);
		triangles.ad.push(ad_orig);
		triangles.ind.push(ad_ind);
		if(ind[h]){
			for(let i = 0; i < ind[h].length; i++){
				for(let j = 0; j < ad[h].length; j++){
					if(ind[h][i] == ad[h][j][2])
					triangles.ind[h].push(j);
				}
			}
		}
		if(just_one != -1) break;
	}
}
