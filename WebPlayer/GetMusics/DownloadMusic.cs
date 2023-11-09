
using WebPlayer.Models;
using YoutubeExplode;
using YoutubeExplode.Search;
using YoutubeExplode.Videos.Streams;
using YoutubeExplode.Videos;
using System;
using YoutubeExplode.Playlists;

namespace WebPlayer.GetMusics;

public class DownloadMusic
{


	public static async Task<List<SearchResultViewModel>> SearchByName(string name)
	{
		var list = new List<SearchResultViewModel>();
		YoutubeClient client = new YoutubeClient();
		var result = client.Search.GetVideosAsync(name);
		await foreach (var resultItem in result)
		{
			list.Add(
				new SearchResultViewModel()
				{
					Nome = resultItem.Title,
					Author = resultItem.Author.ToString(),
					thumbnail = resultItem.Thumbnails.FirstOrDefault().Url,
					Code = resultItem.Id
				}
				); ;
			if(list.Count >= 21)
			{
				break;
			}
		}

		return list;

	}

	public static async Task<MusicViewModel> GetMusic(string search)
	{
		YoutubeClient client = new YoutubeClient();
		MusicViewModel? music;
		string name;
		var result = await client.Videos.GetAsync(search);
		if (result != null)
		{


			name = RemoveSpecialCaracters(result.Title);
			var rootDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Musicas");
			string directory = Path.Combine(rootDir, name + ".mp3");
			string directoryCut = Path.Combine($"/Musicas/{name}.mp3");

			if (!File.Exists(directory))
			{
				ValueTask<Video> taks = client.Videos.GetAsync(result.Url);
				Video video = taks.Result;
				ValueTask<StreamManifest> manisfests = client.Videos.Streams.GetManifestAsync(result.Url);
				StreamManifest manisfest = manisfests.Result;
				IStreamInfo streamInfo = manisfest.Streams[manisfest.Streams.Count - 1];
				await client.Videos.Streams.DownloadAsync(streamInfo, directory);

			}
			music = new MusicViewModel()
			{
				Nome = name,
				Dir = directoryCut,
				Thumbnail = result.Thumbnails[0].Url.ToString(),
				Author = result.Author.ToString()
			};

		}
		else
			music = new MusicViewModel();
		return music;


	}

	public static async Task<MusicViewModel> AutoReprodution(string channel)
	{
		int cont = 0;
		var RandomNumber = new Random();
		PlaylistVideo music;
		List<PlaylistVideo> results = new List<PlaylistVideo>();
		var youtubeClient = new YoutubeClient();
		ChannelSearchResult? firstChannel = null;
		var channelName = youtubeClient.Search.GetChannelsAsync(channel);
		await foreach (var fc in channelName)
		{
			firstChannel = fc;
			break;
		}
		Console.WriteLine(firstChannel.Title);

		var channelVideos = youtubeClient.Channels.GetUploadsAsync(firstChannel.Id);

		await foreach (var video in channelVideos)
		{
			if (cont > 30)
			{
				break;
			}
			results.Add(video);
			cont++;
		}
		music = results[RandomNumber.Next(results.Count)];
		return await GetMusic(music.Id);

	}
	static private string RemoveSpecialCaracters(string name)
	{
		//Essa função serve para remover os caracters proibidos na hora de criar o Path para o música
		string specialCaracters = "<>:/\\|?*\"";
		int cont = 0;
		foreach (char specialCaracter in specialCaracters)
		{
			do
			{
				if (name.IndexOf(specialCaracter, cont) != -1)
				{
					name = name.Remove(name.IndexOf(specialCaracter), 1);
					cont++;
				}
				else
				{
					cont = 0;
					break;
				}
			} while (true);

		}
		return name;

	}
}
