using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebPlayer.Models;
using WebPlayer.GetMusics;

namespace WebPlayer.Controllers
{
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;


		public HomeController(ILogger<HomeController> logger)
		{
			_logger = logger;
			
		}
		[Route("Main")]
		public IActionResult MainPage()
		{
			return PartialView();
		}
		public IActionResult Index()
		{
			return View();
		}

		public IActionResult AutoPlay(string channel)
		{
			var music = DownloadMusic.AutoReprodution(channel).Result;
			return Json(music);
		}

		[Route("SearchResult/{search}")]
		public  IActionResult SearchResult(string search)
		{
			var resultList = DownloadMusic.SearchByName(search).Result;
			return PartialView(resultList);
		}

		[Route("PlayMusic/{nome}")]
		public IActionResult PlayMusic(string nome)
		{
			var Resultado = DownloadMusic.GetMusic(nome).Result;
			return Json(Resultado);
			
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}