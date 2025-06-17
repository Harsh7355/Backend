import express from 'express'
import jwtverify from '../middlewares/auth.middleware.js'
import {createPlaylist,getPlaylistById,updatePlaylist,deletePlaylist,addVideoToPlaylist,removeVideoFromPlaylist,getUserPlaylists} from '../controllers/playlist.controller.js'
const router=express.Router();

router.route("/").post(jwtverify,createPlaylist)
router.route("/:playlistid").get(jwtverify,getPlaylistById)
router.route("/:playlistid").patch(jwtverify,updatePlaylist)
router.route("/:playlistid").delete(jwtverify,deletePlaylist)
router.route("/add/:videoId/:playlistId").patch(jwtverify,addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(jwtverify,removeVideoFromPlaylist);
router.route("/user/:userid").get(jwtverify,getUserPlaylists);





export default router